import { atom } from "recoil";
import { TotalData } from "../types";

export const totalAtom = atom<TotalData>({
  key: "Total",
  default: {},
});
