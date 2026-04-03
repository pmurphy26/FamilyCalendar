import { useEffect, useState } from "react";
import "./Calendar.css";
import "./Toggle.css";
import {
  compareTimes,
  //daysInMonthDict,
  getNextWeek,
  getWeekPeriod,
  getPrevWeek,
  //getPrevMonth,
  monthNumToString,
  padNumberWithZeros,
  daysInMonthDict,
} from "../helpers.ts/constants";
import type {
  CalendarDate,
  CalendarDay,
  CalendarEvent,
} from "../../../shared/types";

type CalendarInputProps = {
  label: "WEEK" | "MONTH"; // | "DAY";
  days: CalendarDay[];
  value: string; //initially current, later just selected date
  onChange: (value: CalendarDate) => void;
  checkPeriod: (periodStart: CalendarDate, periodEnd: CalendarDate) => void;
};

function processDateString(value: string): CalendarDate {
  const strArr = value.split("-");

  //console.log(strArr);

  const dateObj: CalendarDate = value
    ? {
        day: Number(strArr[2]),
        month: Number(strArr[1]),
        year: Number(strArr[0]),
      }
    : ({} as CalendarDate);

  return dateObj;
}

/**
 * Calendar UI Object
 *
 * @param label calendar period type
 * @param value current date string
 * @param onChange function to run when value is changed
 */
export function CalendarGrid({
  label,
  value,
  days,
  onChange,
  checkPeriod,
}: CalendarInputProps) {
  const selectedDay: CalendarDate = processDateString(value);

  const daysInMonth = new Date(
    selectedDay.year,
    selectedDay.month,
    0,
  ).getDate();
  const firstDay = new Date(
    selectedDay.year,
    selectedDay.month - 1,
    1,
  ).getDay(); //0-6, day of week first day of month is on

  const { periodStart, periodEnd } =
    label == "WEEK"
      ? getWeekPeriod(firstDay, selectedDay)
      : {
          periodStart: { ...selectedDay, day: 1 },
          periodEnd: {
            ...selectedDay,
            day: daysInMonthDict(selectedDay.month, selectedDay.year),
          },
        };
  const currentDate: Date = new Date();

  useEffect(() => {
    //console.log(`Checking ${periodStart.day}, ${periodEnd.day}`);
    checkPeriod(periodStart, periodEnd);
  }, [periodStart, periodEnd]);

  return (
    <div className="calendar-grid">
      {/* Header showing / selecting current period */}
      <div className="calendar-header">
        {/* < Button */}
        <button
          onClick={() => {
            if (label == "MONTH") {
              onChange({
                day: Math.min(
                  daysInMonthDict(
                    selectedDay.month == 1 ? 12 : selectedDay.month - 1,
                    selectedDay.year,
                  ),
                  selectedDay.day,
                ),
                month: selectedDay.month == 1 ? 12 : selectedDay.month - 1,
                year:
                  selectedDay.month == 1
                    ? selectedDay.year - 1
                    : selectedDay.year,
              });
            } else {
              //week
              if (selectedDay && periodStart && periodEnd) {
                const newPeriod = getPrevWeek(
                  periodStart,
                  selectedDay,
                  periodEnd,
                );

                onChange({
                  day: newPeriod.selectedDay,
                  month: newPeriod?.month ?? selectedDay.month,
                  year: newPeriod?.year ?? selectedDay.year,
                });
              }
            }
          }}
        >
          ‹
        </button>
        {/* Label in middle showing current period */}
        <span>
          {monthNumToString[periodStart.month]}{" "}
          {label == "MONTH"
            ? `1-${daysInMonth}, `
            : label == "WEEK"
              ? `${periodStart.day} - ${monthNumToString[periodEnd.month]} ${periodEnd.day}, `
              : ""}
          {selectedDay.year}
        </span>
        {/* > button */}
        <button
          onClick={() => {
            if (label == "MONTH") {
              onChange({
                day: Math.min(
                  daysInMonthDict(
                    selectedDay.month == 12 ? 1 : selectedDay.month + 1,
                    selectedDay.year,
                  ),
                  selectedDay.day,
                ),
                month: selectedDay.month == 12 ? 1 : selectedDay.month + 1,
                year:
                  selectedDay.month == 12
                    ? selectedDay.year + 1
                    : selectedDay.year,
              });
            } else {
              //week
              if (selectedDay && periodStart && periodEnd) {
                const nextWeekInfo = getNextWeek(
                  periodStart,
                  selectedDay,
                  periodEnd,
                );

                /*console.log(
                  `Next week is ${nextWeekInfo.newPeriodStart.month}/${
                    nextWeekInfo.newPeriodStart.day
                  } to ${nextWeekInfo.newPeriodEnd.month}/${
                    nextWeekInfo.newPeriodEnd.day
                  }. Selected day is ${nextWeekInfo.selectedDay}.`,
                );
                */

                onChange({
                  day: nextWeekInfo.selectedDay,
                  month: nextWeekInfo?.month ?? selectedDay.month,
                  year: nextWeekInfo?.year ?? selectedDay.year,
                });
              }
            }
          }}
        >
          ›
        </button>
      </div>

      {/* Sun, Mon, Tues, Wed, Thu, Fri, Sat */}
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* All days in period */}
      <div className="calendar-days">
        {days.map((d, i) => {
          /*console.log(
              `${d.date.month}/${d.date.day}/${d.date.year}`,
              i,
              periodStart,
              periodEnd,
            );*/
          return (
            <div
              key={i}
              className={`day ${
                d.date.day === selectedDay.day
                  ? "selected"
                  : d.date.day === currentDate.getDate() &&
                      currentDate.getMonth() + 1 == d.date.month &&
                      currentDate.getFullYear() == d.date.year
                    ? "current"
                    : ""
              }`}
              onClick={() => {
                if (!d) return;
                onChange(d.date);
              }}
            >
              {`${d.date.month}/${d.date.day}`}
            </div>
          );
        })}
      </div>

      {/* Bottom of week */}
      {label === "WEEK" && (
        <div className="calendar-bottom-row">
          {days.map((d, i) => {
            return (
              <div key={`W-${i}`} className="calendar-bottom-cell">
                <CalendarWeekDayUI calendarDay={d} />
              </div>
            );
          })}
        </div>
      )}
      {/*      <p>{`${currentDate.getDate()}, ${currentDate.getMonth()}, ${currentDate.getFullYear()}`}</p>
      <p>{`${selectedDay.day}, ${selectedDay.month}, ${selectedDay.year}`}</p>*/}
    </div>
  );
}

/**
 * Helper element for Calendar Weekday columns
 *
 * @param calendarDay
 * @returns
 */
function CalendarWeekDayUI({ calendarDay }: { calendarDay: CalendarDay }) {
  return (
    <div className="calendar-weekday-column">
      {calendarDay.events.length > 0 ? (
        calendarDay.events
          .sort((c1: CalendarEvent, c2: CalendarEvent) => compareTimes(c1, c2))
          .map((e) => (
            <CalendarWeekDayColumnEventUI
              key={`${e.id}-cwdceui`}
              calendarEvent={e}
            />
          ))
      ) : (
        <p>...</p>
      )}
    </div>
  );
}

/**
 * Helper element for Calendar Weekday Events in the columns
 *
 * @param calendarDay
 * @returns
 */
function CalendarWeekDayColumnEventUI({
  calendarEvent,
}: {
  calendarEvent: CalendarEvent;
}) {
  return (
    <div
      className="calendar-weekday-column-event"
      style={{
        background: `${
          calendarEvent.for && calendarEvent.for.colorStr
            ? calendarEvent.for.colorStr
            : "rgb(137, 137, 131)"
        }`,
      }}
    >
      <div className="calendar-weekday-column-event-text">
        {calendarEvent.title}
      </div>
      <div className="calendar-weekday-column-event-text">
        <p>{`${padNumberWithZeros(calendarEvent.time.hour, 2)}:${padNumberWithZeros(calendarEvent.time.minute, 2)}`}</p>{" "}
        {/*${calendarEvent.time.isAM ? "AM" : "PM"}`}</p>*/}
      </div>
    </div>
  );
}

/**
 * UI for the calendar header bar
 *
 * @param title
 * @param togglePeriod
 * @param createNewEvent
 */
export function CalendarHeaderBar({
  selectedDate,
  selectedPeriod,
  togglePeriod,
  createNewEvent,
}: {
  selectedDate: CalendarDate;
  selectedPeriod: "MONTH" | "WEEK";
  togglePeriod: () => void;
  createNewEvent: () => void;
}) {
  const [curr, setCurr] = useState<"LEFT" | "RIGHT">(
    selectedPeriod == "MONTH" ? "RIGHT" : "LEFT",
  );
  return (
    <div className="calendar-page-header">
      <div
        className="calendar-event-title"
        style={{ width: "70%", height: "100%", padding: "0px 20px" }}
      >
        <button className="create-btn" onClick={createNewEvent}>
          <span className="plus">+</span>
          Create
        </button>

        <ToggleUI
          val1={"WEEK"}
          val2={"MONTH"}
          curr={curr}
          onToggle={() => {
            togglePeriod();

            setCurr(curr == "RIGHT" ? "LEFT" : "RIGHT");
          }}
        />
      </div>

      <h3
        style={{
          borderLeft: "2px solid #4a90e2",
          borderRight: "2px solid #4a90e2",
          background: "#e6f0ff",
          height: "100%",
          margin: "0px",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "4px",
        }}
      >
        {`${monthNumToString[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}
      </h3>
    </div>
  );
}

export function ToggleUI({
  val1,
  val2,
  curr,
  onToggle,
}: {
  val1: any;
  val2: any;
  curr: "LEFT" | "RIGHT";
  onToggle: () => void;
}) {
  const selected = curr;

  return (
    <div className="toggle-container">
      <div className={`toggle-slider ${selected === "RIGHT" ? "right" : ""}`} />

      <button
        className={selected === "LEFT" ? "active" : ""}
        onClick={() => onToggle()}
      >
        {val1}
      </button>

      <button
        className={selected === "RIGHT" ? "active" : ""}
        onClick={() => onToggle()}
      >
        {val2}
      </button>
    </div>
  );
}
