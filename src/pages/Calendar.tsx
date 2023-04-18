import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import styles from "./Calendar.module.css";
import "./calendar.css";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { eventApi } from "../api/eventApi";
import { useRecoilState } from "recoil";
import { eventAtom } from "../recoil/EventAtom";
import { Category } from "../components/Category";

interface Transaction {
  id: number;
  amount: number;
  category: number;
  storeName: string;
}

interface Events {
  [date: string]: Transaction[];
}

export const Calendar = () => {
  const [events, setEvents] = useRecoilState(eventAtom);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [amount, setAmount] = useState<
    {
      title: string;
      start: string;
    }[]
  >();
  const [total, setTotal] = useState(0);

  // イベント一覧を取得
  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await eventApi.getAll();
        console.log(res.data);
        setEvents(res.data);
      } catch (err: any) {
        if (err.status === 401) {
          alert("認証エラー\n再ログインしてください");
          navigate("/login");
        } else {
          alert("登録に失敗しました");
          console.log(err);
        }
      }
    };
    getEvents();
  }, [setEvents, navigate]);

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
