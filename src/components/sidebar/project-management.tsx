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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useMediaQuery } from "react-responsive";
import { Project } from "@/types";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { useRouter } from "next/navigation";
import { userStore } from "@/stores/user-store";
import { deleteProject, projectsStore } from "@/stores/projects-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProject } from "@/api/projects/route";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "",
  }),
  status: z.string().max(32),
});

interface ProjectManagementProps {
  children: React.ReactNode;
  project: Project;
}

export function ProjectManagement({
  children,
  project,
}: ProjectManagementProps) {
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
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

    if (!user || !user.role) setUserRole("member");

    setUserRole(user.role);
  }, [project]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.status}</DialogDescription>
        </DialogHeader>
        {userRole === "owner" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 mt-3"
            >
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
              <Button className="w-fit" type="submit">
                обновить
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
