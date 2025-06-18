import { MembersBreadcrumb } from "@/components/members/breadcrumb";
import { MembersList } from "@/components/members/list";
import { MembersSearchCombobox } from "@/components/members/members-search-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MembersPage() {
  return (
    <main className="min-h-screen w-full">
      <MembersBreadcrumb />
      <div className="flex flex-col w-[90%] min-h-screen mx-auto items-center pt-24 gap-8 lg:w-[66%]">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mx-auto">
            <TabsTrigger className="cursor-pointer" value="members">
              участники
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="invite">
              приглашение пользователей
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <MembersList />
          </TabsContent>
          <TabsContent value="invite">
            <MembersSearchCombobox />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
