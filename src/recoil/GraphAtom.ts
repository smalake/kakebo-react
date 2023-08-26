import { atom } from "recoil";
import { Graphs } from "../types";

export const graphAtom = atom<Graphs>({
  key: "Graph",
  default: {},
});
