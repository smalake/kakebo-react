import React, { memo, useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import styles from "./Calendar.module.css";
import "./calendar.css";
import { Box, CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventFlagAtom, eventSelector } from "../../recoil/EventAtom";
import { Category } from "../../components/Category";
import { Event } from "../../types";
import { eventApi } from "../../api/eventApi";
import { db } from "../../db/db";

export const Calendar = memo(() => {
  const navigate = useNavigate();
  const events = useRecoilValue(eventSelector).event;
  const eventAmount = useRecoilValue(eventSelector).calendar;
  const [selectedDate, setSelectedDate] = useState("");
  const revision = localStorage.getItem("revision");
  const [eventFlag, setEventFlag] = useRecoilState(eventFlagAtom);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<
    {
      title: string;
      start: string;
    }[]
  >();

  useEffect(() => {
    const checkRevision = async () => {
      try {
        const res = await eventApi.revision();
        if (res.data.revision !== Number(revision)) {
          const eventData = await eventApi.getAll();
          const revision = await eventApi.revision();
          db.transaction("rw", db.event, () => {
            db.event.clear();
            db.event.bulkAdd(eventData.data.events);
          })
            .then(() => {
              const flag = eventFlag + 1;
              setEventFlag(flag);
              // リビジョンを保存
              localStorage.setItem("revision", revision.data.revision);
            })
            .catch((error) => {
              console.log(error);
              alert("エラーが発生しました");
            });
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    checkRevision();
  }, []);

  // カレンダー内の金額をセット
  useEffect(() => {
    setAmount(eventAmount);
  }, [eventAmount]);

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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "330px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
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
      )}
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
