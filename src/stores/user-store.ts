import { UserState } from "@/types";
import { proxy } from "valtio";

export const userStore = proxy<UserState>({
  user: null,
  loading: true,
  error: null,
});
