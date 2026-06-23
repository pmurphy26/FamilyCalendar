import { useEffect, useRef, useState } from "react";
import { padNumberWithZeros } from "../helpers/constants";
import { BooleanForm, DateForm, NumberForm, TextForm } from "../helpers/forms";
import type {
  CalendarDate,
  CalendarEvent,
  Family,
} from "../../../shared/types";
import "./CalendarEvent.css";
import { SelectVehicleUI } from "./VehicleSituation";

export function EditCalendarEventUI({
  originalEvent,
  family,
  originalEventDate,
  saveEditedEvent,
  openEvent,
  deleteCalendarEvent,
}: {
  originalEvent: CalendarEvent;
  family: Family;
  originalEventDate: CalendarDate;
  saveEditedEvent: (c: CalendarEvent, d: CalendarDate) => void;
  openEvent: () => void;
  deleteCalendarEvent: (cID: number) => void;
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

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!buttonRef.current || !buttonRef.current.contains(target))
      ) {
        setConfirmDelete(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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

        {/* DATE FOR EVENT */}
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

        {/* LOCATION */}
        <div className="calendar-event-section">
          <TextForm
            title="Location"
            textValue={newEvent.location}
            onSetVal={(s) => setNewEvent({ ...newEvent, location: s })}
          />
        </div>

        {/* NOTES */}
        <div className="calendar-event-section">
          <TextForm
            title="Notes"
            textValue={newEvent.notes}
            onSetVal={(s) => setNewEvent({ ...newEvent, notes: s })}
          />
        </div>

        {/* EVENT FOR */}
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

        {/* Delete button */}
        {!confirmDelete ? (
          <button
            ref={buttonRef}
            className="delete-button"
            onClick={() => {
              console.log(`implement confirmation and then deletion`);
              setConfirmDelete((d) => !d);
              //deleteEvent(currentCalendarEvent.id);
            }}
          >
            Delete Event
          </button>
        ) : (
          <div
            className="delete-button-confirm"
            ref={dropdownRef}
            onClick={async () => {
              deleteCalendarEvent(originalEvent.id);
            }}
          >
            Confirm Deletion
          </div>
        )}
      </div>
    </div>
  );
}
