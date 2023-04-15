import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import styles from "./Calendar.module.css";
import "./calendar.css";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack } from "@mui/material";
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Transaction {
  id: number;
  amount: number;
  category: string;
  store: string;
}

interface Events {
  [date: string]: Transaction[];
}

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState<Events>({
    "2023-04-01": [
      { id: 1, amount: 100, category: "食費", store: "イオン" },
      { id: 3, amount: 200, category: "食費", store: "イオン" },
    ],
    "2023-04-10": [
      { id: 2, amount: 300, category: "食費", store: "イオン" },
      { id: 10, amount: 400, category: "外食費", store: "マック" },
      { id: 5, amount: 500, category: "日用品", store: "スギ薬局" },
    ],
  });
  const [amount, setAmount] = useState<
    {
      title: string;
      start: string;
    }[]
  >();
  const [total, setTotal] = useState(0);

  // イベントをカレンダー内に表示させるためのフォーマットへと変換
  useEffect(() => {
    const formattedEvents = [];
    for (const date in events) {
      const transactions = events[date];
      let total = 0;

      for (const transaction of transactions) {
        total += transaction.amount;
      }

      formattedEvents.push({
        title: `${total}円`,
        start: date,
      });
    }

    setAmount(formattedEvents);
  }, [events]);

  const headerToolbar = {
    start: "prev",
    center: "title",
    end: "next",
  };

  const handleClick = useCallback((arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
  }, []);
  const handleEventClick = useCallback((arg: EventClickArg) => {
    const date = arg.event.start;
    if (date != null) {
      const res = format(date, "yyyy-MM-dd");
      setSelectedDate(res);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[jaLocale]}
            locale="ja"
            headerToolbar={headerToolbar}
            contentHeight="auto"
            events={amount}
            dateClick={handleClick}
            eventClick={handleEventClick}
          />
        </div>
      </div>
      <div className={styles.total}>
        <p className={styles.totalTitle}>1ヶ月の支出合計</p>
        <p className={styles.totalContents}>{total}円</p>
      </div>
      <div>
        <EventList events={events} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export const EventList = ({ events, selectedDate }: { events: Events; selectedDate: string }) => {
  return (
    <ul className={styles.eventList}>
      {selectedDate && events[selectedDate] ? (
        events[selectedDate].map((item, index) => (
          <li key={index} className={styles.eventContents}>
            <Link to={`/edit-event/${item.id}`} className={styles.eventItem}>
              <span className={styles.totalTitle}>
                {item.category} ({item.store})
              </span>
              <span className={styles.totalContents}>{item.amount}円</span>
            </Link>
          </li>
        ))
      ) : (
        <p></p>
      )}
    </ul>
  );
};
