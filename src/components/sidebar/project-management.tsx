import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Project } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores/user-store";
import { deleteProject, projectsStore } from "@/stores/projects-store";
import { SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProject } from "@/api/projects/route";
import { useIsMobile } from "@/hooks/use-mobile";
import { Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChangeAvatar } from "./change-avatar";
import { API_URL } from "@/lib/config";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "",
  }),
  status: z.string().max(32),
});

interface ProjectManagementProps {
  children: React.ReactNode;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  project: Project;
}

export function ProjectManagement({
  children,
  setIsOpen,
  project,
}: ProjectManagementProps) {
  const [userRole, setUserRole] = useState<string>("");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState<boolean>(false);
  const router = useRouter();
  const isTabletOrMobile = useIsMobile();
  const projectSnapshot = useSnapshot(projectStore);
  const userSnapshot = useSnapshot(userStore);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      status: project.status,
    },
  });
  const handleDelete = async (projectId: string) => {
    if (projectId === projectSnapshot.project?._id) {
      router.push("/");

      // force currentProject rerender
      userStore.loading = true;
      userStore.loading = false;

      projectStore.project = null;
      localStorage.removeItem("currentProject");
    }

    deleteProject(projectId);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.promise(updateProject(project._id, values.title, values.status), {
      loading: "обновление проекта...",
      success: async (response) => {
        const updatedProject = await response.json();
        const projectId = project._id;
        const oldProject = projectsStore.projects?.find(
          (project) => project._id === projectId
        );

        Object.assign(oldProject ?? {}, updatedProject);

        return "проект успешно обновлен";
      },
      error: () => {
        return "произошла ошибка при обновлении проекта";
      },
    });
  };

  useEffect(() => {
    const user = project.users.filter(
      (user) => user.userId._id === userSnapshot.user?._id
    )[0];

    if (!user || !user.role) {
      setUserRole("member");

      return;
    }

    setUserRole(user.role);
  }, [project]);

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-1 items-center">
            <span>{project.title}</span>
            <Trash2
              className="h-4 w-4 text-muted-foreground hover:text-accent-foreground hover:cursor-pointer"
              onClick={() => {
                handleDelete(project._id);
              }}
            />
          </DialogTitle>
          <DialogDescription>{project.status}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          {userRole === "owner" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-3 w-full"
              >
                <div className="flex gap-6 items-center w-full">
                  <div className="flex flex-col items gap-3 w-full">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>название</FormLabel>
                          <FormControl>
                            <Input placeholder="проект" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>статус</FormLabel>
                          <FormControl>
                            <Input placeholder="в процессе" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <Button className="w-fit" type="submit">
                    обновить
                  </Button> */}
                  </div>
                  <div>
                    <Avatar
                      className="relative h-30 w-30 hover:cursor-pointer hover:opacity-80 transition-opacity group"
                      onClick={() => {
                        setAvatarDialogOpen(true);
                      }}
                    >
                      <AvatarImage
                        src={`${API_URL}${projectSnapshot.project?.imageUrl}`}
                      />
                      <AvatarFallback className="text-2xl text-muted-foreground">
                        {project.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <ChangeAvatar
                      projectId={project._id}
                      open={avatarDialogOpen}
                      onOpenChange={setAvatarDialogOpen}
                      currentAvatar={
                        projectSnapshot.project?.imageUrl === ""
                          ? ""
                          : `${API_URL}${projectSnapshot.project?.imageUrl}`
                      }
                    />
                  </div>
                </div>
                <Button className="w-fit" type="submit">
                  обновить
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
