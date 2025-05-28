import { Ellipsis } from "lucide-react";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { API_URL } from "@/lib/config";

export function MemberCard({ user }: { user: User }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 ">
          <Avatar className="rounded-md">
            <AvatarImage src={`${API_URL}${user.avatarUrl}`} />
            <AvatarFallback className="flex items-center justify-center text-sm rounded-lg aspect-square bg-accent text-muted-foreground">
              {user.username.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{user.username}</span>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
        <Button className="text-muted-foreground" variant="ghost">
          <Ellipsis />
        </Button>
      </CardHeader>
    </Card>
  );
}
