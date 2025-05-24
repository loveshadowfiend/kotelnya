import { MembersList } from "@/components/members/list";
import { MembersSearchCombobox } from "@/components/members/members-search-combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MembersPageProps {
  userId: string;
  username: string;
  email: string;
}

export default function MembersPage() {
  return (
    <main className="flex flex-col h-screen mx-auto w-[66%] items-center pt-16 gap-8">
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mx-auto">
          <TabsTrigger className="cursor-pointer" value="members">
            участники проекта
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
    </main>
  );
}
