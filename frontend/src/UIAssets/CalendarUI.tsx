import { useState } from "react";
import "./CalendarUI.css";
import { CalendarGrid, CalendarHeaderBar } from "./Calendar";
import type {
  AuthState,
  CalendarDate,
  CalendarDay,
  CalendarEvent,
  Family,
} from "../../../shared/types";
import {
  compareDates,
  datesAreEqual,
  datesEqual,
  daysInMonthDict,
  padNumberWithZeros,
} from "../helpers/constants";
import {
  CalendarDayEventUI,
  CalendarEventUI,
  CreateCalendarEventUI,
  EditCalendarEventUI,
} from "./CalendarEvent";
import { mockEvent } from "../helpers/mockData";
import {
  createDrivingSituation,
  createEvent,
  editDrivingSituation,
  editEvent,
  getCalendarDaysInPeriod,
} from "../helpers/apiCalls";

/**
 * Main application UI
 */
export function CalendarUI({
  calendarID,
  myFamily,
  rh,
}: {
  calendarID: number;
  myFamily: Family;
  rh: AuthState;
}) {
  const currDate: Date = new Date();
  const [period, setPeriod] = useState<"WEEK" | "MONTH">("WEEK");
  const [currentCalendarDay, setCurrentDay] = useState<CalendarDay>({
    date: {
      day: currDate.getDate(),
      month: currDate.getMonth() + 1,
      year: currDate.getFullYear(),
    },
    events: [],
  } as CalendarDay);
  const [calendarDaysInPeriod, setCalendarDaysInPeriod] = useState<
    CalendarDay[]
  >([]);

  const [currentCalendarEvent, setCurrentCalendarEvent] =
    useState<CalendarEvent>(mockEvent);

  const dateStr: string = `${currentCalendarDay.date.year}-${padNumberWithZeros(
    currentCalendarDay.date.month,
    2,
  )}-${padNumberWithZeros(currentCalendarDay.date.day, 2)}`;

  const [rightSideDisplayType, setRightSideDisplayType] = useState<
    "DAY" | "EVENT" | "CREATE" | "EDIT"
  >("DAY");

  /**
   * matches the given CalendarDay's date with the corresponding CalendarDay in the period
   * sets currentCalendarDay as well
   *
   * @param newCurr calendar day with date
   * @returns void
   */
  function setCurrentCalendarDay(newCurr: CalendarDay) {
    const dayInPeriod = calendarDaysInPeriod.filter((cd) =>
      datesEqual(cd, newCurr),
    );

    if (dayInPeriod.length > 0) {
      setCurrentDay(dayInPeriod[0]);
      return;
    }

    setCurrentDay(newCurr);
  }

  /**
   * Checks to make sure that a period hasn't changed
   * and loads in the new period's CalendarDays if it has
   *
   * @param periodStart
   * @param periodEnd
   */
  async function checkPeriod(
    periodStart: CalendarDate,
    periodEnd: CalendarDate,
  ) {
    if (
      calendarDaysInPeriod.length == 0 ||
      !(
        datesAreEqual(periodStart, calendarDaysInPeriod[0].date) &&
        datesAreEqual(
          periodEnd,
          calendarDaysInPeriod[calendarDaysInPeriod.length - 1].date,
        )
      )
    ) {
      //console.log(`Getting a new period: ${periodStart.month}/${periodStart.day}`);
      const allDaysInPeriod = await getNewPeriod(periodStart, periodEnd);
      setCalendarDaysInPeriod(allDaysInPeriod);
    }
  }

  /**
   * Array with a CalendarDay object for every day in the period start to end (inclusive)
   *
   * @param newStart start date
   * @param newEnd end date
   * @returns
   */
  async function getNewPeriod(
    newStart: CalendarDate,
    newEnd: CalendarDate,
  ): Promise<CalendarDay[]> {
    //console.log("Getting new period:", newStart, newEnd);
    const daysWithEvents: CalendarDay[] = await getCalendarDaysInPeriod(
      calendarID,
      newStart,
      newEnd,
      rh?.token ?? "",
    );

    let allDaysInPeriod: CalendarDay[] = [];
    let currentDay: number = newStart.day;

    //console.log(daysWithEvents.length, currentDay, newEnd, newStart > newEnd);

    for (const dayWithEvent of daysWithEvents) {
      while (currentDay < dayWithEvent.date.day) {
        allDaysInPeriod.push({
          date: {
            day: currentDay,
            month: currentCalendarDay.date.month,
            year: currentCalendarDay.date.year,
          },
          events: [],
        } as CalendarDay);

        currentDay += 1;
      }

      allDaysInPeriod.push(dayWithEvent);
      currentDay += 1;
    }

    const dim = daysInMonthDict(newStart.month, newStart.year);

    while (
      currentDay <= (newStart.day > newEnd.day ? newEnd.day + dim : newEnd.day)
    ) {
      const day = currentDay > dim ? currentDay - dim : currentDay;
      const month = currentDay > dim ? newEnd.month : newStart.month;
      /*console.log(
        newStart,
        currentCalendarDay.date.day,
        currentDay,
        newEnd,
        month,
        currentCalendarDay.date.month,
      );*/
      allDaysInPeriod.push({
        date: {
          day: day,
          month: month,
          year: currentCalendarDay.date.year,
        },
        events: [],
      } as CalendarDay);

      currentDay += 1;
    }

    //console.log(allDaysInPeriod);
    return allDaysInPeriod;
  }

  /**
   * Edits a given calendar event
   *
   * @param e the calendar event being edited
   */
  async function editCalendarEvent(
    e: CalendarEvent,
    rh: AuthState,
    d?: CalendarDate,
  ) {
    //console.log(d);
    //console.log(e.notes);
    let eventDayID = -1;
    if (d) {
      const newDayID =
        compareDates(calendarDaysInPeriod[0].date, d) < 0 &&
        compareDates(
          calendarDaysInPeriod[calendarDaysInPeriod.length - 1].date,
          d,
        ) > 0
          ? (calendarDaysInPeriod.find((cdip) => datesAreEqual(cdip.date, d))
              ?.id ?? -1)
          : -1;

      //console.log("New ID", newDayID);
      const res = await editEvent(e, rh?.token ?? "", {
        newCalendarDayID: newDayID,
        newDate: d,
      });
      //console.log("Data:", res);

      if (res.result) {
        eventDayID = res.result;
      }
    } else {
      const res = await editEvent(e, rh?.token ?? "");
      //console.log("Data:", res);
      if (res.result) {
        eventDayID = res.result;
      }
    }

    if (e.drivingSituation) {
      const currentArrival = currentCalendarEvent.drivingSituation?.arrival;
      const currentDeparture = currentCalendarEvent.drivingSituation?.departure;

      const { arrival, departure } = e.drivingSituation;
      console.log(currentArrival);
      console.log(currentDeparture);
      console.log(arrival);
      console.log(departure);

      if (!!arrival) {
        if (!!currentArrival) {
          //alter current driving event
          console.log("alter arrival");
          await editDrivingSituation(
            { ...e, drivingSituation: { arrival: e.drivingSituation.arrival } },
            rh?.token ?? "",
          );
        } else {
          console.log("create new arrival");
          //create new driving situation
          await createDrivingSituation(
            { ...e, drivingSituation: { arrival: e.drivingSituation.arrival } },
            rh?.token ?? "",
          );
        }
      }

      if (!!departure) {
        if (!!currentDeparture && !!departure) {
          console.log("alter departure");
          //alter current driving event
          await editDrivingSituation(
            {
              ...e,
              drivingSituation: { departure: e.drivingSituation.departure },
            },
            rh?.token ?? "",
          );
        } else {
          await createDrivingSituation(
            {
              ...e,
              drivingSituation: { departure: e.drivingSituation.departure },
            },
            rh?.token ?? "",
          );
        }
      }
      /*
      if (currentCalendarEvent.drivingSituation) {
        await editDrivingSituation(e, rh?.token ?? "");
      } else {
        await createDrivingSituation(e, rh?.token ?? "");
      }*/
    }

    return eventDayID;
  }

  /**
   * Saves the given edited event to the calendarday with the given date
   *
   * @param c
   * @param d
   */
  async function saveEditedEvent(
    c: CalendarEvent,
    rh: AuthState,
    d: CalendarDate,
  ) {
    //backend call to edit item
    const eventDateChanged = !datesAreEqual(d, currentCalendarDay.date);
    const newEventDayID = await editCalendarEvent(
      c,
      rh,
      ...(eventDateChanged ? [d] : []),
    );

    //update calendar event
    setCurrentCalendarEvent(c);

    //TODO: Edit this to handle date changes
    if (!eventDateChanged) {
      //update calendar day
      const newEvents = [
        ...currentCalendarDay.events.map((ccde: CalendarEvent) => {
          if (ccde.id == c.id) {
            return c;
          }
          return ccde;
        }),
      ];
      //console.log(newEvents);
      const newDay = {
        ...currentCalendarDay,
        events: newEvents,
      };
      setCurrentDay(newDay);
      setCalendarDaysInPeriod([
        ...calendarDaysInPeriod.map((cdip: CalendarDay) => {
          if (datesEqual(cdip, currentCalendarDay)) {
            return newDay;
          }
          return cdip;
        }),
      ]);
    } else {
      const newDay = calendarDaysInPeriod.find(
        (cdip) => cdip.id == newEventDayID,
      ) ?? { id: newEventDayID, date: d, events: [] };
      //console.log(newDay);

      setCalendarDaysInPeriod(
        calendarDaysInPeriod.map((cdip) => {
          // console.log(cdip?.id ?? -1, newEventDayID);
          if (datesAreEqual(cdip.date, d)) {
            return { ...newDay, events: [...newDay.events, c] };
          }
          if (currentCalendarDay.id == cdip.id) {
            return {
              ...cdip,
              events: [...cdip.events.filter((cde) => cde.id != c.id)],
            };
          }
          return cdip;
        }),
      );

      setCurrentDay({ ...newDay, events: [...newDay.events, c] });
    }

    setRightSideDisplayType("EVENT");
  }

  function selectNewCalendarDayOnGrid(v: CalendarDate) {
    console.log(`Selected ${v.month}/${v.day}/${v.year} as new date`);

    setCurrentCalendarDay({
      date: v,
      //setcurrentcalendarday matches the date up with the day in the period
      events: [],
    });
    setRightSideDisplayType("DAY");
  }

  /**
   * Main UI
   */
  return (
    <div className="calendar-container">
      <CalendarHeaderBar
        selectedDate={currentCalendarDay.date}
        selectedPeriod={period}
        createNewEvent={() => {
          setRightSideDisplayType("CREATE");
        }}
        togglePeriod={async () => {
          //console.log("Chaning period type");
          if (period == "WEEK") {
            const np = await getNewPeriod(
              { ...currentCalendarDay.date, day: 1 },
              {
                ...currentCalendarDay.date,
                day: daysInMonthDict(
                  currentCalendarDay.date.month,
                  currentCalendarDay.date.year,
                ),
              },
            );

            setCalendarDaysInPeriod(np);
          }
          setPeriod(period == "WEEK" ? "MONTH" : "WEEK");
        }}
      />
      <div className="calendar-split">
        <div className="left-split">
          <CalendarGrid
            label={period}
            value={dateStr}
            days={calendarDaysInPeriod}
            onChange={(v: CalendarDate) => {
              selectNewCalendarDayOnGrid(v);
            }}
            checkPeriod={async (
              periodStart: CalendarDate,
              periodEnd: CalendarDate,
            ) => {
              //console.log(periodStart);
              //console.log(periodEnd);

              await checkPeriod(periodStart, periodEnd);
            }}
          />
        </div>
        <div className="right-split">
          {/*<!-- Scrollable sidebar -->*/}
          <div
            className="right-split-inner"
            style={{
              padding: `${rightSideDisplayType == "DAY" ? "10px 4px" : "0px"}`,
            }}
          >
            {/*Day object*/}
            {rightSideDisplayType == "DAY" &&
              currentCalendarDay.events.map(
                (calendarEvent: CalendarEvent, i) => (
                  <CalendarDayEventUI
                    key={`c-${i}`}
                    event={calendarEvent}
                    openEvent={() => {
                      setCurrentCalendarEvent(calendarEvent);
                      setRightSideDisplayType("EVENT");
                    }}
                  />
                ),
              )}
            {/* Event object */}
            {rightSideDisplayType == "EVENT" && (
              <CalendarEventUI
                event={currentCalendarEvent}
                openEvent={() => {
                  setRightSideDisplayType("DAY");
                }}
                editEvent={() => {
                  setRightSideDisplayType("EDIT");
                }}
              />
            )}
            {/* Create new event */}
            {rightSideDisplayType == "CREATE" && (
              <CreateCalendarEventUI
                family={myFamily}
                familyIndividualID={rh.user?.familyIndividualID ?? -1}
                openEvent={() => {
                  setRightSideDisplayType("DAY");
                }}
                createEvent={async (
                  c: CalendarEvent,
                  newEventDate: CalendarDate,
                ) => {
                  const newEventInPeriod: Boolean =
                    compareDates(calendarDaysInPeriod[0].date, newEventDate) <=
                      0 &&
                    compareDates(
                      newEventDate,
                      calendarDaysInPeriod[calendarDaysInPeriod.length - 1]
                        .date,
                    ) <= 0;

                  if (newEventInPeriod) {
                    //console.log("Need to update current period");
                    const idx = calendarDaysInPeriod.findIndex((dip) =>
                      datesEqual(dip, {
                        date: newEventDate,
                        events: [] as CalendarEvent[],
                      } as CalendarDay),
                    );
                    //console.log("IDX:", idx);

                    if ((calendarDaysInPeriod[idx].id ?? -1) == -1) {
                      //console.log("need to create new calendar day");
                      await createEvent(-1, c, rh?.token ?? "", {
                        calendarID: calendarID,
                        calendarDate: newEventDate,
                      });
                    } else {
                      //console.log("day should already exist");
                      await createEvent(
                        calendarDaysInPeriod[idx].id ?? -1,
                        c,
                        rh?.token ?? "",
                      );
                    }
                    setCalendarDaysInPeriod((prevPeriod) => {
                      const updatedPeriod = [...prevPeriod];
                      updatedPeriod[idx] = {
                        ...updatedPeriod[idx],
                        events: [...updatedPeriod[idx].events, c],
                      };
                      return updatedPeriod;
                    });

                    setCurrentDay({
                      ...calendarDaysInPeriod[idx],
                      events: [...calendarDaysInPeriod[idx].events, c],
                    });
                  } else {
                    await createEvent(-1, c, rh?.token ?? "", {
                      calendarID: calendarID,
                      calendarDate: newEventDate,
                    });
                  }

                  setRightSideDisplayType("DAY");
                }}
              />
            )}
            {/* Edit event */}
            {rightSideDisplayType == "EDIT" && (
              <EditCalendarEventUI
                originalEvent={currentCalendarEvent}
                family={myFamily}
                originalEventDate={currentCalendarDay.date}
                openEvent={() => {
                  setRightSideDisplayType("EVENT");
                }}
                saveEditedEvent={async (c: CalendarEvent, d: CalendarDate) =>
                  await saveEditedEvent(c, rh, d)
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
