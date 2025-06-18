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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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

      // Load image to get dimensions - adjust for mobile
      const img = new Image();
      img.onload = () => {
        const maxSize = isMobile ? 280 : 400;
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

      // Ensure minimum size first - smaller on mobile
      const minSize = isMobile ? 40 : 50;
      updated.size = Math.max(minSize, updated.size);

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

  // Helper function to get touch/mouse coordinates
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return {
      clientX: (e as React.MouseEvent).clientX,
      clientY: (e as React.MouseEvent).clientY,
    };
  };

  const handleCornerDrag = (corner: string, startX: number, startY: number) => {
    const startCropArea = { ...cropArea };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      let newSize = startCropArea.size;
      let newX = startCropArea.x;
      let newY = startCropArea.y;

      switch (corner) {
        case "top-left":
          const deltaTopLeft = Math.min(deltaX, deltaY);
          newSize = startCropArea.size - deltaTopLeft;
          newX = startCropArea.x + deltaTopLeft;
          newY = startCropArea.y + deltaTopLeft;
          break;
        case "top-right":
          const deltaTopRight = Math.max(deltaX, -deltaY);
          newSize = startCropArea.size + deltaTopRight;
          newY = startCropArea.y - deltaTopRight;
          break;
        case "bottom-left":
          const deltaBottomLeft = Math.max(-deltaX, deltaY);
          newSize = startCropArea.size + deltaBottomLeft;
          newX = startCropArea.x - deltaBottomLeft;
          break;
        case "bottom-right":
          const deltaBottomRight = Math.max(deltaX, deltaY);
          newSize = startCropArea.size + deltaBottomRight;
          break;
      }

      // Apply constraints based on corner being dragged
      const minSize = isMobile ? 40 : 50;
      const maxSize = Math.min(imageSize.width, imageSize.height);

      // For corners that change position (top-left, top-right, bottom-left)
      if (corner === "top-left") {
        const maxSizeFromPosition = Math.min(
          startCropArea.x + startCropArea.size,
          startCropArea.y + startCropArea.size
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newX = startCropArea.x + startCropArea.size - newSize;
        newY = startCropArea.y + startCropArea.size - newSize;
      } else if (corner === "top-right") {
        const maxSizeFromPosition = Math.min(
          imageSize.width - startCropArea.x,
          startCropArea.y + startCropArea.size
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newY = startCropArea.y + startCropArea.size - newSize;
      } else if (corner === "bottom-left") {
        const maxSizeFromPosition = Math.min(
          startCropArea.x + startCropArea.size,
          imageSize.height - startCropArea.y
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
        newX = startCropArea.x + startCropArea.size - newSize;
      } else if (corner === "bottom-right") {
        const maxSizeFromPosition = Math.min(
          imageSize.width - startCropArea.x,
          imageSize.height - startCropArea.y
        );
        newSize = Math.max(minSize, Math.min(maxSizeFromPosition, newSize));
      }

      handleCropAreaChange({ x: newX, y: newY, size: newSize });
    };

    const handleEnd = () => {
      setIsDragging(null);
      document.removeEventListener("mousemove", handleMove as EventListener);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("touchend", handleEnd);
    };

    setIsDragging(corner);
    document.addEventListener("mousemove", handleMove as EventListener);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove as EventListener);
    document.addEventListener("touchend", handleEnd);
  };

  const handleCropMove = (startX: number, startY: number) => {
    const startCropX = cropArea.x;
    const startCropY = cropArea.y;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      handleCropAreaChange({
        x: startCropX + deltaX,
        y: startCropY + deltaY,
      });
    };

    const handleEnd = () => {
      setIsDragging(null);
      document.removeEventListener("mousemove", handleMove as EventListener);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("touchend", handleEnd);
    };

    setIsDragging("move");
    document.addEventListener("mousemove", handleMove as EventListener);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove as EventListener, {
      passive: false,
    });
    document.addEventListener("touchend", handleEnd);
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
      loading: "загрузка изображения...",
      success: async (response) => {
        const data: User = await response.json();
        userStore.user = data;

        if (croppedImageUrl) {
          onAvatarChange?.(croppedImageUrl);
        }
        setLoading(false);
        return "изображение профиля успешно обновлено!";
      },
      error: (error) => {
        setLoading(false);
        return `ошибка при обновлении изображения профиля. пожалуйста, попробуйте еще раз. ${error}`;
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
        <DialogContent
          className={`${
            isMobile
              ? "w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto"
              : "sm:max-w-lg"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={isMobile ? "text-lg" : ""}>
              обновление изображение профиля
            </DialogTitle>
            <DialogDescription className={isMobile ? "text-sm" : ""}>
              загрузите новую картинку пользователя. поддерживаемый формат: JPG,
              PNG, GIF. максимальный размер: 5 МБ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!originalImage && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className={`${isMobile ? "h-20 w-20" : "h-24 w-24"}`}>
                    <AvatarImage
                      src={currentAvatar || "/placeholder.svg"}
                      alt="Current avatar"
                    />
                    <AvatarFallback>
                      <UserIcon
                        className={`${isMobile ? "h-10 w-10" : "h-12 w-12"}`}
                      />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="avatar-upload"
                    className={isMobile ? "text-sm" : ""}
                  >
                    выберите изображение
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    disabled={loading}
                    className={isMobile ? "text-sm" : ""}
                  />
                  <p
                    className={`text-muted-foreground ${
                      isMobile ? "text-xs" : "text-xs"
                    }`}
                  >
                    поддерживаемый формат: JPG, PNG, GIF. максимальный размер:
                    5МБ.
                  </p>
                </div>
              </div>
            )}

            {showCropper && originalImage && (
              <div className="space-y-4">
                <div className="text-center">
                  <p
                    className={`font-medium mb-2 ${
                      isMobile ? "text-sm" : "text-sm"
                    }`}
                  >
                    обрежьте свое изображение
                  </p>
                  <p
                    className={`text-muted-foreground ${
                      isMobile ? "text-xs" : "text-xs"
                    }`}
                  >
                    {isMobile
                      ? "касайтесь и перетаскивайте для настройки"
                      : "перетаскивайте квадрат для передвижения • перетаскивайте углы для изменения размера"}
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
                      className="absolute border-2 border-blue-500 bg-blue-500/20 select-none touch-none"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.size,
                        height: cropArea.size,
                        cursor: isDragging === "move" ? "grabbing" : "grab",
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const coords = getEventCoordinates(e);
                        handleCropMove(coords.clientX, coords.clientY);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        const coords = getEventCoordinates(e);
                        handleCropMove(coords.clientX, coords.clientY);
                      }}
                    >
                      {/* Center move icon */}
                      <Move
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 pointer-events-none ${
                          isMobile ? "h-3 w-3" : "h-4 w-4"
                        }`}
                      />

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

                        const handleSize = isMobile ? "w-4 h-4" : "w-3 h-3";
                        const handleOffset = isMobile ? -8 : -6;

                        return (
                          <div
                            key={corner}
                            className={`absolute ${handleSize} bg-blue-500 border border-white rounded-sm hover:bg-blue-600 transition-colors touch-none`}
                            style={{
                              top:
                                isTopLeft || isTopRight
                                  ? handleOffset
                                  : undefined,
                              bottom:
                                isBottomLeft || isBottomRight
                                  ? handleOffset
                                  : undefined,
                              left:
                                isTopLeft || isBottomLeft
                                  ? handleOffset
                                  : undefined,
                              right:
                                isTopRight || isBottomRight
                                  ? handleOffset
                                  : undefined,
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
                            onTouchStart={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const coords = getEventCoordinates(e);
                              handleCornerDrag(
                                corner,
                                coords.clientX,
                                coords.clientY
                              );
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCropper(false);
                      setCroppedImage(null);
                      setOriginalImage(null);
                    }}
                    className={`${isMobile ? "w-full" : "flex-1"}`}
                    size={isMobile ? "default" : "default"}
                  >
                    назад
                  </Button>
                  <Button
                    onClick={cropImage}
                    className={`${isMobile ? "w-full" : "flex-1"}`}
                    size={isMobile ? "default" : "default"}
                  >
                    обрезать
                  </Button>
                </div>
              </div>
            )}

            {croppedImage && !showCropper && (
              <div className="space-y-4">
                <div className="text-center">
                  <p
                    className={`font-medium mb-4 ${
                      isMobile ? "text-sm" : "text-sm"
                    }`}
                  >
                    предварительный просмотр
                  </p>
                  <Avatar
                    className={`mx-auto ${
                      isMobile ? "h-24 w-24" : "h-32 w-32"
                    }`}
                  >
                    <AvatarImage
                      src={croppedImageUrl || "/placeholder.svg"}
                      alt="Cropped avatar"
                    />
                    <AvatarFallback>
                      <UserIcon
                        className={`${isMobile ? "h-12 w-12" : "h-16 w-16"}`}
                      />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
                  <Button
                    variant="outline"
                    onClick={resetCrop}
                    className={`${isMobile ? "w-full" : "flex-1"}`}
                    size={isMobile ? "default" : "default"}
                  >
                    <RotateCw
                      className={`mr-2 ${isMobile ? "h-4 w-4" : "h-4 w-4"}`}
                    />
                    повторно обрезать
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`${isMobile ? "w-full" : "flex-1"}`}
                    size={isMobile ? "default" : "default"}
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className={`mr-2 animate-spin ${
                            isMobile ? "h-4 w-4" : "h-4 w-4"
                          }`}
                        />
                        загрузка...
                      </>
                    ) : (
                      <>
                        <Upload
                          className={`mr-2 ${isMobile ? "h-4 w-4" : "h-4 w-4"}`}
                        />
                        сохранить аватар
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
