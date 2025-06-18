import { InvitationsBreadcrumb } from "@/components/invitations/breadcrumb";
import { InvitationsList } from "@/components/invitations/list";

export default function InvitationsPage() {
  return (
    <main className="min-h-screen w-full">
      <InvitationsBreadcrumb />
      <div className="mx-auto w-[90%] pt-24 lg:w-[66%]">
        <InvitationsList />
      </div>
    </main>
  );
}
