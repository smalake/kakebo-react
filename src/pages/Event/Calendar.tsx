import React, { memo, useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import styles from "./Calendar.module.css";
import "./calendar.css";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { eventSelector } from "../../recoil/EventAtom";
import { Category } from "../../components/Category";
import { Event } from "../../types";

export const Calendar = memo(() => {
  const navigate = useNavigate();
  const events = useRecoilValue(eventSelector).event;
  const eventAmount = useRecoilValue(eventSelector).calendar;
  const [selectedDate, setSelectedDate] = useState("");
  const [amount, setAmount] = useState<
    {
      title: string;
      start: string;
    }[]
  >();

  // カレンダー内の金額をセット
  useEffect(() => {
    setAmount(eventAmount);
  });

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

  const handleChange = (event: any) => {
    if (event.target.value === 1) {
      navigate("/calendar-private");
    }
  };

  return (
    <div>
      <div className={styles.calendar}>
        <Box sx={{ textAlign: "right", marginBottom: "10px" }}>
          <FormControl variant="standard" sx={{ width: "50%", textAlign: "center" }}>
            <Select labelId="select-label" id="select-kakebo" value={0} label="家計簿選択" onChange={handleChange}>
              <MenuItem value={0}>共有家計簿</MenuItem>
              <MenuItem value={1}>プライベート家計簿</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
});

export const EventList = ({ events, selectedDate }: { events: Event; selectedDate: string }) => {
  return (
    <ul className={styles.eventList}>
      {selectedDate && events[selectedDate] ? (
        events[selectedDate].map((item, index) => (
          <li key={index} className={styles.eventContents}>
            <Link to={`/event-edit/${item.id}`} className={styles.eventItem}>
              <span className={styles.detail}>
                <Category catNum={item.category} /> {item.store_name ? `(${item.store_name})` : ""}
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
