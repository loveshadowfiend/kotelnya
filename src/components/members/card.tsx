import { Ellipsis } from "lucide-react";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { User } from "@/types";

export function MemberCard({ user }: { user: User }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <span>{user.username}</span>
          <CardDescription>{user.email}</CardDescription>
        </div>
        <Button className="text-muted-foreground" variant="ghost">
          <Ellipsis />
        </Button>
      </CardHeader>
    </Card>
  );
}
