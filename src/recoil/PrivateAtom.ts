import { atom, selector } from "recoil";
import { Event, OneEvent, Graph, Total, FormatAmount } from "../types";
import { db } from "../db/db";

export const privateFlagAtom = atom({
  key: "PrivateFlag",
  default: 0,
});

// indexedDBの値を変換
export const privateSelector = selector({
  key: "PrivateSelector",
  get: async ({ get }) => {
    const flag = get(privateFlagAtom);
    // Linter対応
    if (false) {
      console.log(flag);
    }

    const dbData = await db.private.toArray();
    const formattedAmount: FormatAmount = {};
    const events: Event = {};
    const graphs: Graph = {};
    const totals: Total = {};

    dbData.forEach((data) => {
      const event: OneEvent = {
        id: data.id,
        amount: data.amount,
        category: data.category,
        store_name: data.store,
      };
      const date = data.date;

      // formattedAmountの処理
      if (formattedAmount[date]) {
        formattedAmount[date] += event.amount;
      } else {
        formattedAmount[date] = event.amount;
      }

      // eventsの処理
      if (events[date]) {
        events[date].push(event);
      } else {
        events[date] = [event];
      }

      // graphの処理
      if (graphs[date.slice(0, -3)]) {
        graphs[date.slice(0, -3)][data.category] += data.amount;
      } else {
        const graph = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        graph[data.category] = data.amount;
        graphs[date.slice(0, -3)] = graph;
      }

      // totalの処理
      if (totals[date.slice(0, -3)]) {
        totals[date.slice(0, -3)] += data.amount;
      } else {
        totals[date.slice(0, -3)] = data.amount;
      }
    });
    // formattedAmountの変換
    const calendar = Object.entries(formattedAmount).map(([key, value]) => ({
      title: `${value}円`,
      start: key,
    }));
    return { calendar: calendar, event: events, graph: graphs, total: totals };
  },
});
