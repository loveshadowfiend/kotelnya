import { InvitationsList } from "@/components/invitations/list";

export default function InvitationsPage() {
  return (
    <main className="flex flex-col min-h-screen mx-auto w-[66%] items-center pt-16 gap-8">
      <InvitationsList />
    </main>
  );
}
