import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import styles from "./Calendar.module.css";
import "./calendar.css";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { eventAtom } from "../recoil/EventAtom";
import { Category } from "../components/Category";
import { Events } from "../types";

export const Calendar = () => {
  const events = useRecoilValue(eventAtom);
  const [selectedDate, setSelectedDate] = useState("");
  const [amount, setAmount] = useState<
    {
      title: string;
      start: string;
    }[]
  >();

  // イベントをカレンダー内に表示させるためのフォーマットへと変換
  useEffect(() => {
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
    <div>
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
            <Link to={`/event-edit/${item.id}`} className={styles.eventItem}>
              <span className={styles.detail}>
                <Category catNum={item.category} /> {item.storeName ? `(${item.storeName})` : ""}
              </span>
              <span className={styles.eventAmount}>{item.amount}円</span>
            </Link>
          </li>
        ))
      ) : (
        <p></p>
      )}
    </ul>
  );
};
