import { Ellipsis, Star } from "lucide-react";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { API_URL } from "@/lib/config";
import { MembersUserDropdown } from "./user-dropdown";

export function MemberCard({ user, role }: { user: User; role: string }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 ">
          <Avatar className="rounded-md">
            <AvatarImage src={`${API_URL}${user.avatarUrl}`} />
            <AvatarFallback className="flex items-center justify-center text-sm rounded-lg aspect-square bg-accent text-muted-foreground">
              {(user.username ?? "").substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span>{user.username}</span>
              {role === "owner" && (
                <Star className="h-3 w-3 fill-accent-foreground stroke-accent-foreground" />
              )}
            </div>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
        <MembersUserDropdown
          userId={user._id}
          userName={user.username}
          role={role}
        >
          <Button className="text-muted-foreground" variant="ghost">
            <Ellipsis />
          </Button>
        </MembersUserDropdown>
      </CardHeader>
    </Card>
  );
}
