import { useState } from "react";
import { padNumberWithZeros } from "../helpers/constants";
import { BooleanForm, DateForm, NumberForm, TextForm } from "../helpers/forms";
import type {
  CalendarDate,
  CalendarEvent,
  Family,
} from "../../../shared/types";
import "./CalendarEvent.css";
import { SelectVehicleUI } from "./VehicleSituation";

/**
 * Creates a new single calendar event
 *
 * @param param0
 * @returns
 */
export function CreateCalendarEventUI({
  family,
  familyIndividualID,
  createEvent,
  openEvent,
}: {
  family: Family;
  familyIndividualID: number;
  createEvent: (
    c: CalendarEvent,
    newEventDate: { day: number; month: number; year: number },
  ) => void;
  openEvent: () => void;
}) {
  const currDate: Date = new Date();
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: -1,
    location: "",
    startTime: { hour: 12, minute: 0, isAM: false },
    endTime: { hour: 12, minute: 0, isAM: false },
    title: "",
    notes: "",
    createdBy: family.members.find((f) => f.id == familyIndividualID),
  } as CalendarEvent);
  const [eventDate, setEventDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: currDate.getDate(),
    month: currDate.getMonth() + 1,
    year: currDate.getFullYear(),
  });
  const [eventForIndex, setEventForIndex] = useState<number>(-1);
  const [passengerToAddIndex, setPassengerToAddIndex] = useState<number>(-1);

  return (
    <div className="calendar-event">
      {/* HEADER */}
      <div className="event-header">
        <button className="event-cancel-btn" onClick={openEvent}>
          Cancel
        </button>
        <div className="event-title">Create Event</div>
      </div>

      <div className="calendar-event-body">
        {/* TITLE */}
        <div className="calendar-event-section">
          <TextForm
            title="Title"
            textValue={newEvent.title}
            onSetVal={(s) => setNewEvent({ ...newEvent, title: s })}
          />
        </div>

        {/* START TIME */}
        <div className="calendar-event-section">
          <div className="section-label">Start Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.startTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.startTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.startTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        {/* END TIME */}
        <div className="calendar-event-section">
          <div className="section-label">End Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.endTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.endTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.endTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        {/* DATE */}
        <div className="calendar-event-section">
          <DateForm
            title="Date"
            dateValue={`${eventDate.year}-${padNumberWithZeros(
              eventDate.month,
              2,
            )}-${padNumberWithZeros(eventDate.day, 2)}`}
            onSetVal={(s) => {
              const [year, month, day] = s.split("-").map(Number);
              setEventDate({ year, month, day });
            }}
          />
        </div>

        {/* LOCATION */}
        <div className="calendar-event-section">
          <TextForm
            title="Location"
            textValue={newEvent.location}
            onSetVal={(s) => setNewEvent({ ...newEvent, location: s })}
          />
        </div>

        {/* FOR */}
        <div className="calendar-event-section">
          <label>
            For:
            <select
              value={eventForIndex}
              onChange={(e) => {
                const tv = Number(e.target.value);

                if (tv === -1) {
                  const temp = { ...newEvent };
                  delete temp.for;
                  setNewEvent(temp);
                } else {
                  setNewEvent({ ...newEvent, for: family.members[tv] });
                }

                setEventForIndex(tv);
              }}
            >
              {!newEvent.for && <option value={-1}>Choose...</option>}
              {family.members.map((m, i) => (
                <option key={`fm-${m.name}`} value={i}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Transportation */}
        <SelectVehicleUI
          newEvent={newEvent}
          family={family}
          passengerToAddIndex={passengerToAddIndex}
          setNewEvent={setNewEvent}
          setPassengerToAddIndex={setPassengerToAddIndex}
        />

        {/* CREATE BUTTON */}
        <div
          className="save-button"
          onClick={() => {
            if (!newEvent.location) return console.log("assign location");
            if (!newEvent.title) return console.log("assign title");
            console.log(newEvent);
            console.log(eventDate);
            createEvent(newEvent, eventDate);
          }}
        >
          Create
        </div>
      </div>
    </div>
  );
}

export function CreateRecurringCalendarEventUI({
  family,
  familyIndividualID,
  period,
  createEvent,
  openEvent,
}: {
  family: Family;
  familyIndividualID: number;
  period: "MONTHLY" | "WEEKLY";
  createEvent: (
    event: {
      c: CalendarEvent;
      newEventDate: { day: number; month: number; year: number };
    },
    period: "MONTHLY" | "WEEKLY",
    endDate: CalendarDate,
  ) => void;
  openEvent: () => void;
}) {
  const currDate: Date = new Date();
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: -1,
    location: "",
    startTime: { hour: 12, minute: 0, isAM: false },
    endTime: { hour: 12, minute: 0, isAM: false },
    title: "",
    notes: "",
    createdBy: family.members.find((f) => f.id == familyIndividualID),
  } as CalendarEvent);
  const [eventDate, setEventDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: currDate.getDate(),
    month: currDate.getMonth() + 1,
    year: currDate.getFullYear(),
  });
  const [eventEndDate, setEventEndDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: currDate.getDate(),
    month: currDate.getMonth() + 1,
    year: currDate.getFullYear(),
  });
  const [eventForIndex, setEventForIndex] = useState<number>(-1);
  const [passengerToAddIndex, setPassengerToAddIndex] = useState<number>(-1);

  return (
    <div className="calendar-event">
      {/* HEADER */}
      <div className="event-header">
        <button className="event-cancel-btn" onClick={openEvent}>
          Cancel
        </button>
        <div className="event-title">{`Create ${period.charAt(0)}${period.slice(1).toLowerCase()} Event`}</div>
      </div>

      <div className="calendar-event-body">
        {/* TITLE */}
        <div className="calendar-event-section">
          <TextForm
            title="Title"
            textValue={newEvent.title}
            onSetVal={(s) => setNewEvent({ ...newEvent, title: s })}
          />
        </div>

        {/* START TIME */}
        <div className="calendar-event-section">
          <div className="section-label">Start Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.startTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.startTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.startTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        {/* END TIME */}
        <div className="calendar-event-section">
          <div className="section-label">End Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.endTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.endTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.endTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        {/* START DATE */}
        <div className="calendar-event-section">
          <DateForm
            title="Start Date"
            dateValue={`${eventDate.year}-${padNumberWithZeros(
              eventDate.month,
              2,
            )}-${padNumberWithZeros(eventDate.day, 2)}`}
            onSetVal={(s) => {
              const [year, month, day] = s.split("-").map(Number);
              setEventDate({ year, month, day });
            }}
          />
        </div>

        {/* END DATE */}
        <div className="calendar-event-section">
          <DateForm
            title="Until"
            dateValue={`${eventEndDate.year}-${padNumberWithZeros(
              eventEndDate.month,
              2,
            )}-${padNumberWithZeros(eventEndDate.day, 2)}`}
            onSetVal={(s) => {
              const [year, month, day] = s.split("-").map(Number);
              setEventEndDate({ year, month, day });
            }}
          />
        </div>

        {/* LOCATION */}
        <div className="calendar-event-section">
          <TextForm
            title="Location"
            textValue={newEvent.location}
            onSetVal={(s) => setNewEvent({ ...newEvent, location: s })}
          />
        </div>

        {/* FOR */}
        <div className="calendar-event-section">
          <label>
            For:
            <select
              value={eventForIndex}
              onChange={(e) => {
                const tv = Number(e.target.value);

                if (tv === -1) {
                  const temp = { ...newEvent };
                  delete temp.for;
                  setNewEvent(temp);
                } else {
                  setNewEvent({ ...newEvent, for: family.members[tv] });
                }

                setEventForIndex(tv);
              }}
            >
              {!newEvent.for && <option value={-1}>Choose...</option>}
              {family.members.map((m, i) => (
                <option key={`fm-${m.name}`} value={i}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Transportation */}
        <SelectVehicleUI
          newEvent={newEvent}
          family={family}
          passengerToAddIndex={passengerToAddIndex}
          setNewEvent={setNewEvent}
          setPassengerToAddIndex={setPassengerToAddIndex}
        />

        {/* CREATE BUTTON */}
        <div
          className="save-button"
          onClick={() => {
            if (!newEvent.location) return console.log("assign location");
            if (!newEvent.title) return console.log("assign title");
            console.log(newEvent);
            console.log(eventDate);
            createEvent(
              { c: newEvent, newEventDate: eventDate },
              period,
              eventEndDate,
            );
          }}
        >
          Create
        </div>
      </div>
    </div>
  );
}

export function EditCalendarEventUI({
  originalEvent,
  family,
  originalEventDate,
  saveEditedEvent,
  openEvent,
}: {
  originalEvent: CalendarEvent;
  family: Family;
  originalEventDate: CalendarDate;
  saveEditedEvent: (c: CalendarEvent, d: CalendarDate) => void;
  openEvent: () => void;
}) {
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    ...originalEvent,
  });

  const [eventDate, setEventDate] = useState<CalendarDate>(originalEventDate);
  const [passengerToAddIndex, setPassengerToAddIndex] = useState<number>(-1);
  const [eventForIndex, setEventForIndex] = useState<number>(
    originalEvent.for
      ? family.members.findIndex((m) => m.id == originalEvent.for?.id)
      : -1,
  );

  return (
    <div className="calendar-event">
      <div className="event-header">
        <button className="event-cancel-btn" onClick={openEvent}>
          Cancel
        </button>
        <div className="event-title">Edit Event</div>
      </div>

      <div className="calendar-event-body">
        <div className="calendar-event-section">
          <TextForm
            title="Title"
            textValue={newEvent.title}
            onSetVal={(s) => setNewEvent({ ...newEvent, title: s })}
          />
        </div>

        {/* START TIME */}
        <div className="calendar-event-section">
          <div className="section-label">Start Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.startTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.startTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.startTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  startTime: { ...newEvent.startTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        {/* END TIME */}
        <div className="calendar-event-section">
          <div className="section-label">End Time</div>
          <div className="time-row">
            <NumberForm
              title="Hour"
              numberValue={newEvent.endTime.hour}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, hour: n },
                })
              }
            />
            <NumberForm
              title="Min"
              numberValue={newEvent.endTime.minute}
              onSetVal={(n) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, minute: n },
                })
              }
            />
            <BooleanForm
              title="AM"
              boolValue={newEvent.endTime.isAM}
              onSetVal={(b) =>
                setNewEvent({
                  ...newEvent,
                  endTime: { ...newEvent.endTime, isAM: b },
                })
              }
            />
          </div>
        </div>

        <div className="calendar-event-section">
          <DateForm
            title="Date"
            dateValue={`${eventDate.year}-${padNumberWithZeros(eventDate.month, 2)}-${padNumberWithZeros(eventDate.day, 2)}`}
            onSetVal={(s) => {
              const [year, month, day] = s.split("-").map(Number);
              setEventDate({ year, month, day });
            }}
          />
        </div>

        <div className="calendar-event-section">
          <TextForm
            title="Location"
            textValue={newEvent.location}
            onSetVal={(s) => setNewEvent({ ...newEvent, location: s })}
          />
        </div>

        <div className="calendar-event-section">
          <TextForm
            title="Notes"
            textValue={newEvent.notes}
            onSetVal={(s) => setNewEvent({ ...newEvent, notes: s })}
          />
        </div>

        <div className="calendar-event-section">
          <label>
            For:
            <select
              value={eventForIndex}
              onChange={(e) => {
                const tv = Number(e.target.value);
                if (tv === -1) {
                  const temp = { ...newEvent };
                  delete temp.for;
                  setNewEvent(temp);
                } else {
                  setNewEvent({ ...newEvent, for: family.members[tv] });
                }
                setEventForIndex(tv);
              }}
            >
              {!newEvent.for && <option value={-1}>Choose...</option>}
              {family.members.map((m, i) => (
                <option key={`fm-${m.name}`} value={i}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <SelectVehicleUI
          newEvent={newEvent}
          family={family}
          passengerToAddIndex={passengerToAddIndex}
          setNewEvent={setNewEvent}
          setPassengerToAddIndex={setPassengerToAddIndex}
        />

        {/* SAVE BUTTON AT BOTTOM */}
        <div
          className="save-button"
          onClick={() => {
            if (!newEvent.location) return console.log("assign location");
            if (!newEvent.title) return console.log("assign title");
            saveEditedEvent(newEvent, eventDate);
          }}
        >
          Save
        </div>
      </div>
    </div>
  );
}
