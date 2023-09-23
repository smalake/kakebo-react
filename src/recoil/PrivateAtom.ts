import { atom, selector } from "recoil";
import { Events } from "../types";
import { privateApi } from "../api/privateApi";

export const privateAtom = atom<Events>({
  key: "PrivateEvent",
  default: selector({
    key: "PrivateEventGet",
    get: async () => {
      const res = await privateApi.getAll();
      return res.data;
    },
  }),
});

// イベント一覧をカレンダーの形式へと変換
export const privateFormatAtom = selector({
  key: "PrivateEventFormat",
  get: ({ get }) => {
    // eventAtomから値を取得
    const data = get(privateAtom);
    const events = data.event;
    const formattedEvents = [];
    for (const date in events) {
      const transactions = events[date];
      let totalDay = 0;

      for (const transaction of transactions) {
        totalDay += transaction.amount;
      }

      formattedEvents.push({
        title: `${totalDay}円`,
        start: date,
      });
    }
    return formattedEvents;
  },
});
