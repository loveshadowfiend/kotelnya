import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CurrentProject() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="rounded-lg">
        <AvatarImage src="https://i.pinimg.com/474x/8e/71/23/8e7123bec0b1105340b311d51a3ef03d.jpg" />
        <AvatarFallback className="rounded-lg text-sm">PR</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-medium">slime momonga</p>
        <p className="text-muted-foreground overflow-hidden truncate">
          В процессе
        </p>
      </div>
    </div>
  );
}
