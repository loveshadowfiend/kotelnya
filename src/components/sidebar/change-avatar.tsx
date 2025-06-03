"use client";

import * as React from "react";
import {
  Upload,
  User as UserIcon,
  Loader2,
  RotateCw,
  Move,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loadUserAvatar } from "@/api/users/route";
import { User } from "@/types";
import { userStore } from "@/stores/user-store";

interface ChangeAvatarProps {
  currentAvatar?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAvatarChange?: (avatarUrl: string) => void;
  userId: string;
}

interface CropArea {
  x: number;
  y: number;
  size: number;
}

export function ChangeAvatar({
  userId,
  currentAvatar,
  open = false,
  onOpenChange,
  onAvatarChange,
}: ChangeAvatarProps) {
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);
  const [croppedImage, setCroppedImage] = React.useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string | null>(
    null
  );
  const [showCropper, setShowCropper] = React.useState(false);
  const [cropArea, setCropArea] = React.useState<CropArea>({
    x: 0,
    y: 0,
    size: 200,
  });
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Please select an image smaller than 10MB.");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setOriginalImage(imageUrl);
      setShowCropper(true);

      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        const maxSize = 400;
        const aspectRatio = img.width / img.height;
        let displayWidth = maxSize;
        let displayHeight = maxSize;

        if (aspectRatio > 1) {
          displayHeight = maxSize / aspectRatio;
        } else {
          displayWidth = maxSize * aspectRatio;
        }

        setImageSize({ width: displayWidth, height: displayHeight });

        // Set initial crop area to center square
        const minDimension = Math.min(displayWidth, displayHeight);
        const cropSize = minDimension * 0.7;
        setCropArea({
          x: (displayWidth - cropSize) / 2,
          y: (displayHeight - cropSize) / 2,
          size: cropSize,
        });
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCropAreaChange = (newCropArea: Partial<CropArea>) => {
    setCropArea((prev) => {
      const updated = { ...prev, ...newCropArea };

      // Ensure minimum size first
      updated.size = Math.max(50, updated.size);

      // Ensure size doesn't exceed image dimensions
      const maxPossibleSize = Math.min(imageSize.width, imageSize.height);
      updated.size = Math.min(updated.size, maxPossibleSize);

      // Ensure position stays within bounds based on the current size
      updated.x = Math.max(
        0,
        Math.min(imageSize.width - updated.size, updated.x)
      );
      updated.y = Math.max(
        0,
        Math.min(imageSize.height - updated.size, updated.y)
      );

      return updated;
    });
  };

  const handleCornerDrag = (corner: string, startX: number, startY: number) => {
    const startCropArea = { ...cropArea };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newSize = startCropArea.size;
      let newX = startCropArea.x;
      let newY = startCropArea.y;

      switch (corner) {
        case "top-left":
          // Use the smaller delta to maintain square aspect ratio
          const deltaTopLeft = Math.min(deltaX, deltaY);
          newSize = startCropArea.size - deltaTopLeft;
          newX = startCropArea.x + deltaTopLeft;
          newY = startCropArea.y + deltaTopLeft;
          break;
        case "top-right":
          // Use the larger delta to maintain square aspect ratio
          const deltaTopRight = Math.max(deltaX, -deltaY);
          newSize = startCropArea.size + deltaTopRight;
          newY = startCropArea.y - deltaTopRight;
          break;
        case "bottom-left":
          // Use the larger delta to maintain square aspect ratio
          const deltaBottomLeft = Math.max(-deltaX, deltaY);
          newSize = startCropArea.size + deltaBottomLeft;
          newX = startCropArea.x - deltaBottomLeft;
          break;
        case "bottom-right":
          // Use the smaller delta to maintain square aspect ratio
          const deltaBottomRight = Math.max(deltaX, deltaY);
          newSize = startCropArea.size + deltaBottomRight;
          break;
      }

      // Apply constraints based on corner being dragged
      const minSize = 50;
      const maxSize = Math.min(imageSize.width, imageSize.height);

      // For corners that change position (top-left, top-right, bottom-left)
      if (corner === "top-left") {
        // Limit size based on available space from current position
        const maxSizeFromPosition = Math.min(
          startCropArea.x + startCropArea.size, // Can't go past left edge
          startCropArea.y + startCropArea.size // Can't go past top edge
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newX = startCropArea.x + startCropArea.size - newSize;
        newY = startCropArea.y + startCropArea.size - newSize;
      } else if (corner === "top-right") {
        // Limit size based on available space
        const maxSizeFromPosition = Math.min(
          imageSize.width - startCropArea.x, // Can't go past right edge
          startCropArea.y + startCropArea.size // Can't go past top edge
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newY = startCropArea.y + startCropArea.size - newSize;
      } else if (corner === "bottom-left") {
        // Limit size based on available space
        const maxSizeFromPosition = Math.min(
          startCropArea.x + startCropArea.size, // Can't go past left edge
          imageSize.height - startCropArea.y // Can't go past bottom edge
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newX = startCropArea.x + startCropArea.size - newSize;
      } else if (corner === "bottom-right") {
        // Limit size based on available space from current position
        const maxSizeFromPosition = Math.min(
          imageSize.width - startCropArea.x, // Can't go past right edge
          imageSize.height - startCropArea.y // Can't go past bottom edge
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
      }

      handleCropAreaChange({ x: newX, y: newY, size: newSize });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    setIsDragging(corner);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleCropMove = (startX: number, startY: number) => {
    const startCropX = cropArea.x;
    const startCropY = cropArea.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      handleCropAreaChange({
        x: startCropX + deltaX,
        y: startCropY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    setIsDragging("move");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const cropImage = () => {
    if (!originalImage || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;

    // Calculate the actual crop coordinates relative to the original image
    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;

    const actualCropX = cropArea.x * scaleX;
    const actualCropY = cropArea.y * scaleY;
    const actualCropSize = cropArea.size * Math.min(scaleX, scaleY);

    // Set canvas size to desired output size
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Draw the cropped image
    ctx.drawImage(
      img,
      actualCropX,
      actualCropY,
      actualCropSize,
      actualCropSize,
      0,
      0,
      outputSize,
      outputSize
    );

    // Convert to blob and create URL
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          setCroppedImage(file);
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImageUrl(croppedUrl);
          setShowCropper(false);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleUpload = async () => {
    if (!croppedImage) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", croppedImage);
    toast.promise(loadUserAvatar(userId, formData), {
      loading: "Загрузка аватара...",
      success: async (response) => {
        const data: User = await response.json();
        userStore.user = data;

        if (croppedImageUrl) {
          onAvatarChange?.(croppedImageUrl);
        }
        setLoading(false);
        return "Аватар успешно обновлен!";
      },
      error: (error) => {
        setLoading(false);
        return `Ошибка при обновлении аватара. Пожалуйста, попробуйте еще раз. ${error}`;
      },
    });
  };

  const resetCrop = () => {
    setCroppedImage(null);
    setShowCropper(true);
  };

  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setOriginalImage(null);
      setCroppedImage(null);
      setCroppedImageUrl(null);
      setShowCropper(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange?.(false);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Обновление аватара</DialogTitle>
            <DialogDescription>
              Загрузите новую картинку пользователя. Поддерживаемый формат: JPG,
              PNG, GIF. Максимальный размер: 5 МБ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!originalImage && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={currentAvatar || "/placeholder.svg"}
                      alt="Current avatar"
                    />
                    <AvatarFallback>
                      <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar-upload">Выберите изображение</Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Поддерживаемый формат: JPG, PNG, GIF. Максимальный размер:
                    5МБ.
                  </p>
                </div>
              </div>
            )}

            {showCropper && originalImage && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">
                    Обрежьте свое изображение
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Перетаскивайте квадрат для передвижения • Перетаскивайте
                    углы для изменения размера
                  </p>
                </div>

                <div className="flex justify-center">
                  <div
                    className="relative border-2 border-dashed border-gray-300 inline-block"
                    style={{ width: imageSize.width, height: imageSize.height }}
                  >
                    <img
                      ref={imageRef}
                      src={originalImage || "/placeholder.svg"}
                      alt="Crop preview"
                      className="block select-none"
                      style={{
                        width: imageSize.width,
                        height: imageSize.height,
                      }}
                      crossOrigin="anonymous"
                      draggable={false}
                    />

                    {/* Crop overlay */}
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20 select-none"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.size,
                        height: cropArea.size,
                        cursor: isDragging === "move" ? "grabbing" : "grab",
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCropMove(e.clientX, e.clientY);
                      }}
                    >
                      {/* Center move icon */}
                      <Move className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />

                      {/* Corner handles */}
                      {[
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                      ].map((corner) => {
                        const isTopLeft = corner === "top-left";
                        const isTopRight = corner === "top-right";
                        const isBottomLeft = corner === "bottom-left";
                        const isBottomRight = corner === "bottom-right";

                        return (
                          <div
                            key={corner}
                            className="absolute w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-nwse-resize hover:bg-blue-600 transition-colors"
                            style={{
                              top: isTopLeft || isTopRight ? -6 : undefined,
                              bottom:
                                isBottomLeft || isBottomRight ? -6 : undefined,
                              left: isTopLeft || isBottomLeft ? -6 : undefined,
                              right:
                                isTopRight || isBottomRight ? -6 : undefined,
                              cursor:
                                isTopLeft || isBottomRight
                                  ? "nwse-resize"
                                  : isTopRight || isBottomLeft
                                  ? "nesw-resize"
                                  : "nwse-resize",
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCornerDrag(corner, e.clientX, e.clientY);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCropper(false);
                      setCroppedImage(null);
                      setOriginalImage(null);
                    }}
                    className="flex-1"
                  >
                    Назад
                  </Button>
                  <Button onClick={cropImage} className="flex-1">
                    Обрезать
                  </Button>
                </div>
              </div>
            )}

            {croppedImage && !showCropper && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-4">
                    Предварительный просмотр
                  </p>
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage
                      src={croppedImageUrl || "/placeholder.svg"}
                      alt="Cropped avatar"
                    />
                    <AvatarFallback>
                      <UserIcon className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetCrop}
                    className="flex-1"
                  >
                    <RotateCw className="h-4 w-4 mr-2" />
                    Повторно обрезать
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Сохранить аватар
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* <DialogFooter>
            <Button
              onClick={handleCancel}
              disabled={loading}
              variant="destructive"
            >
              Отмена
            </Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
