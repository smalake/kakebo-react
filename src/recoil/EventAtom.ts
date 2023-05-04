import { atom } from "recoil";
import { Events } from "../types";

export const eventAtom = atom<Events>({
  key: "Event",
  default: {},
});
