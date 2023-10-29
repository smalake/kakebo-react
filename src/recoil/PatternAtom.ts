import { atom, selector } from "recoil";
import { patternApi } from "../api/patternApi";

export const patternAtom = atom({
  key: "PatternAtom",
  default: selector({
    key: "PatternSelector",
    get: async () => {
      const res = await patternApi.get();
      return res.data;
    },
  }),
});
