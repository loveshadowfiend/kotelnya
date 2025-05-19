import { Ellipsis } from "lucide-react";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Button } from "../ui/button";

export function MemberCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <span>utuyun</span>
          <CardDescription>utuyun@dvfu.ru</CardDescription>
        </div>
        <Button className="text-muted-foreground" variant="ghost">
          <Ellipsis />
        </Button>
      </CardHeader>
    </Card>
  );
}
