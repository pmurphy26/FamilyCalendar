import { useState } from "react";
import { padNumberWithZeros } from "../helpers/constants";
import { BooleanForm, DateForm, NumberForm, TextForm } from "../helpers/forms";
import type {
  CalendarDate,
  CalendarEvent,
  Family,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "../../../shared/types";
import "./CalendarEvent.css";
import { mockFamilyIndividuals } from "../helpers/mockData";
import { ToggleUI } from "./Calendar";
import {
  SelectVehicleUI,
  VehiclePassengersUI,
  VehicleSituationUI,
} from "./VehicleSituation";

type CalendarDayEventProps = {
  event: CalendarEvent;
  openEvent: () => void;
  editEvent?: () => void;
};

export function CalendarDayEventUI({
  event,
  openEvent,
}: CalendarDayEventProps) {
  return (
    <div
      className="calendar-day-event"
      style={{
        ...((event.for?.colorStr ?? false) && {
          border: `2px solid ${event.for?.colorStr ?? "black"}`,
        }),
      }}
      onClick={openEvent}
    >
      <p>{event.title}</p>
      <p>{`${padNumberWithZeros(event.startTime.hour, 2)}:${padNumberWithZeros(event.startTime.minute, 2)} ${event.startTime.isAM ? "AM" : "PM"}`}</p>
    </div>
  );
}

function ImageTextCombo({
  imageStr,
  text,
  imageSize = { imageWidth: 40, imageHeight: 40 },
}: {
  imageStr: string;
  text: string;
  imageSize?: {
    imageWidth: number;
    imageHeight: number;
  };
}) {
  return (
    <div className="image-text-combo">
      <picture>
        <img
          src={`${imageStr}.png`}
          alt="Image failed to load. Check connection."
          width={imageSize.imageWidth}
          height={imageSize.imageHeight}
        />
      </picture>
      <p>{text}</p>
    </div>
  );
}

export function CalendarEventUI({
  event,
  openEvent,
  editEvent,
}: CalendarDayEventProps) {
  const [curr, setCurr] = useState<"LEFT" | "RIGHT">("LEFT");
  const activeKey = curr == "LEFT" ? "departure" : "arrival";
  const hasArrival: boolean = !!event.drivingSituation?.arrival;
  const hasDeparture: boolean = !!event.drivingSituation?.departure;
  const hasBoth: boolean = hasArrival && hasDeparture;

  return (
    <div className="calendar-event">
      <div
        style={{
          padding: "4px 4px",
          background: "#044488", //"#c7c7c7"
        }}
        className="calendar-event-title"
      >
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            cursor: "pointer",
            background: "white",
            border: "none",
          }}
        >
          ←
        </button>
        {/* Edit button */}
        <button
          style={{
            background: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={editEvent}
        >
          <picture>
            <img src={`/pencil_img.png`} alt="Edit " width="40" height="40" />
          </picture>
        </button>
      </div>
      <div
        className="calendar-event-attributes"
        style={{ borderBottom: "2px solid black" }}
      >{`${event.title}`}</div>
      <div className="calendar-event-title">
        <ImageTextCombo
          text={`${padNumberWithZeros(event.startTime.hour, 2)}:${padNumberWithZeros(
            event.startTime.minute,
            2,
          )} ${event.startTime.isAM ? "AM" : "PM"}-${padNumberWithZeros(
            event.endTime.hour,
            2,
          )}:${padNumberWithZeros(
            event.endTime.minute,
            2,
          )} ${event.endTime.isAM ? "AM" : "PM"}`}
          imageStr={"/clock_img"}
        />
        {/* Car icon and person who is driving */}
        {event.drivingSituation?.arrival &&
          event.drivingSituation.arrival.driver && (
            <div
              style={{
                width: "40%",
              }}
              className="calendar-event-title"
            >
              <picture style={{ width: "100%" }}>
                <img src={`/car_img.png`} alt="At: " width="40" height="40" />
              </picture>
              {event.drivingSituation.arrival.driver &&
              event.drivingSituation.arrival.driver.imageStr &&
              event.drivingSituation.arrival.driver.imageStr != "" ? (
                <picture style={{ width: "100%" }}>
                  <img src={`/favicon.svg`} alt="At: " width="40" height="40" />
                </picture>
              ) : (
                <p style={{ width: "100%" }}>
                  {event.drivingSituation.arrival.driver?.name ??
                    "No Driver Selected"}
                </p>
              )}
            </div>
          )}
      </div>
      <ImageTextCombo
        imageStr={"/location_img"}
        text={event.location}
        imageSize={{ imageWidth: 30, imageHeight: 30 }}
      />
      {event?.for && (
        <ImageTextCombo
          imageStr="/person_img"
          text={`${event.for.name}`}
          imageSize={{ imageWidth: 35, imageHeight: 35 }}
        />
      )}
      {event.notes && event.notes != "" && (
        <div className="calendar-event-attributes">{`Notes: ${event.notes}`}</div>
      )}
      {/* DRIVING SITUATION */}
      {hasBoth && (
        <div className="toggle-wrapper">
          <ToggleUI
            val1={"departure"}
            val2={"arrival"}
            curr={curr}
            onToggle={() => {
              setCurr(curr == "RIGHT" ? "LEFT" : "RIGHT");
            }}
          />
        </div>
      )}
      {!hasBoth && (hasDeparture || hasArrival) && (
        <div className="single-header">
          {`${hasArrival ? "Arrival" : "Departure"}:`}
        </div>
      )}
      {hasBoth && event.drivingSituation?.[activeKey] && (
        <VehicleSituationUI tfe={event.drivingSituation?.[activeKey]} />
      )}

      {!hasBoth && !hasArrival && event.drivingSituation?.departure && (
        <VehicleSituationUI tfe={event.drivingSituation?.departure} />
      )}
      {!hasBoth && hasArrival && event.drivingSituation?.arrival && (
        <VehicleSituationUI tfe={event.drivingSituation?.arrival} />
      )}
    </div>
  );
}

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
    startTime: { hour: 0, minute: 0, isAM: false },
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

        {/* CREATE BUTTON */}
        <div
          className="save-button"
          onClick={() => {
            if (!newEvent.location) return console.log("assign location");
            if (!newEvent.title) return console.log("assign title");
            createEvent(newEvent, eventDate);
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
