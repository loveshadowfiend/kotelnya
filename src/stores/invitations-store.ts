import { InvitationsState } from "@/types";
import { proxy } from "valtio";

export const invitationsStore = proxy<InvitationsState>();
