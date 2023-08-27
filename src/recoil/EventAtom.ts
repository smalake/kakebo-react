import { atom, selector } from "recoil";
import { Events } from "../types";
import { eventApi } from "../api/eventApi";

export const eventAtom = atom<Events>({
  key: "Event",
  default: selector({
    key: "EventGet",
    get: async () => {
      const res = await eventApi.getAll();
      return res.data;
    },
  }),
});

// イベント一覧をカレンダーの形式へと変換
export const eventFormatAtom = selector({
  key: "EventFormat",
  get: ({ get }) => {
    // eventAtomから値を取得
    const data = get(eventAtom);
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
