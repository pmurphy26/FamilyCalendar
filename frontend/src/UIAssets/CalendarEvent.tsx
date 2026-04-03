import { useState } from "react";
import { padNumberWithZeros } from "../helpers.ts/constants";
import {
  BooleanForm,
  DateForm,
  NumberForm,
  TextForm,
} from "../helpers.ts/forms";
import type {
  CalendarDate,
  CalendarEvent,
  Family,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "../../../shared/types";
import "./CalendarEvent.css";
import { mockFamilyIndividuals } from "../helpers.ts/mockData";

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
      <p>{`${padNumberWithZeros(event.time.hour, 2)}:${padNumberWithZeros(event.time.minute, 2)} ${event.time.isAM ? "AM" : "PM"}`}</p>
    </div>
  );
}

/**
 * UI element for Transportation for event
 *
 * @param v TransportationForEvent being shown in the UI
 * @returns
 */
function VehiclePassengersUI({ v }: { v: TransportationForEvent }) {
  return (
    <div className="driver-table">
      <div
        className="driver-row"
        style={{ height: `${v.vehicle.numPeopleCanFit <= 5 ? 50 : 100 / 3}%` }}
      >
        <div className="driver-cell">{v.driver?.name ?? "Driver"}</div>
        <div className="driver-cell">
          {v.passengers.length > 0 ? v.passengers[0].name : "S"}
        </div>
      </div>

      <div
        className="driver-row"
        style={{ height: `${v.vehicle.numPeopleCanFit <= 5 ? 50 : 100 / 3}%` }}
      >
        <div className="driver-cell">
          {v.passengers.length > 1 ? v.passengers[1].name : "C1"}
        </div>
        <div className="driver-cell">
          {v.passengers.length > 2 ? v.passengers[2].name : "C2"}
        </div>
        {(v.vehicle.numPeopleCanFit == 5 || v.vehicle.numPeopleCanFit >= 8) && (
          <div className="driver-cell">C3</div>
        )}
      </div>

      {v.vehicle.numPeopleCanFit > 5 && (
        <div className="driver-row" style={{ height: `${100 / 3}%` }}>
          <div className="driver-cell">
            {v.passengers.length > 3 ? v.passengers[3].name : "B1"}
          </div>
          <div className="driver-cell">
            {v.passengers.length > 4 ? v.passengers[4].name : "B2"}
          </div>
          <div className="driver-cell">
            {v.passengers.length > 5 ? v.passengers[5].name : "B3"}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Creates a vehiclesituationui for a given CalendarEvent
 *
 * @param event
 * @returns
 */
function VehicleSituationUI({ event }: { event: CalendarEvent }) {
  return (
    <div className="calendar-event-drive-situation">
      <p
        style={{ height: "20%" }}
      >{`Vehicle: ${event.drivingSituation?.vehicle.name ?? ""}`}</p>

      <div
        style={{
          //border: "2px solid black",
          height: "80%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <picture
          style={{
            border: "1px solid black",
            boxSizing: "border-box",
            height: "100%",
            display: "flex",
          }}
        >
          <img
            src={`/car_birds_eye_img.png`}
            alt="Edit "
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              boxSizing: "border-box",
            }}
          />
        </picture>
        <VehiclePassengersUI
          v={event.drivingSituation ?? ({} as TransportationForEvent)}
        />
      </div>

      {event.drivingSituation?.leaveAt && (
        <div className="calendar-event-attributes">
          {`Leaves at ${event.drivingSituation.leaveAt.hour}:${
            event.drivingSituation.leaveAt.minute
          } ${event.drivingSituation.leaveAt.isAM ? "AM" : "PM"}`}
        </div>
      )}
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
          text={`${padNumberWithZeros(event.time.hour, 2)}:${padNumberWithZeros(
            event.time.minute,
            2,
          )} ${event.time.isAM ? "AM" : "PM"}`}
          imageStr={"/clock_img"}
        />
        {/* Car icon and person who is driving */}
        {event.drivingSituation && event.drivingSituation.driver && (
          <div
            style={{
              width: "40%",
            }}
            className="calendar-event-title"
          >
            <picture style={{ width: "100%" }}>
              <img src={`/car_img.png`} alt="At: " width="40" height="40" />
            </picture>
            {event.drivingSituation.driver &&
            event.drivingSituation.driver.imageStr &&
            event.drivingSituation.driver.imageStr != "" ? (
              <picture style={{ width: "100%" }}>
                <img src={`/favicon.svg`} alt="At: " width="40" height="40" />
              </picture>
            ) : (
              <p style={{ width: "100%" }}>
                {event.drivingSituation.driver?.name ?? "No Driver Selected"}
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
      {/*`At: ${event.location}`}</div>*/}
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
      {event.drivingSituation && <VehicleSituationUI event={event} />}
    </div>
  );
}

export function CreateCalendarEventUI({
  family,
  createEvent,
  openEvent,
}: {
  family: Family;
  createEvent: (
    c: CalendarEvent,
    newEventDate: { day: number; month: number; year: number },
  ) => void;
  openEvent: () => void;
}) {
  const [newEvent, setNewEvent] = useState<CalendarEvent>({
    id: -1,
    location: "",
    time: { hour: 12, minute: 0, isAM: false },
    title: "",
    notes: "",
    createdBy: mockFamilyIndividuals[0],
  } as CalendarEvent);
  const [eventDate, setEventDate] = useState<{
    day: number;
    month: number;
    year: number;
  }>({
    day: 25,
    month: 3,
    year: 2026,
  });
  const [eventForIndex, setEventForIndex] = useState<number>(-1);

  return (
    <div className="calendar-event">
      <div style={{ padding: "4px 4px" }} className="calendar-event-title">
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            borderRadius: "0px",
            background: "white",
            border: "none",
          }}
        >
          X
        </button>
      </div>
      {/*<div className="calendar-event-attributes">Attributes</div>
      <div className="calendar-event-title">{newEvent.title}</div>*/}
      <button
        //style={{ background: "white", borderRadius: "2px" }}
        onClick={() => {
          if (!newEvent.location || newEvent.location == "") {
            console.log("assign location");
            return;
          }

          if (!newEvent.title || newEvent.title == "") {
            console.log("assign title");
            return;
          }

          createEvent(newEvent, eventDate);
        }}
      >
        Create
      </button>
      <div className="calendar-event-attributes">
        <TextForm
          title={"Title"}
          textValue={newEvent.title}
          onSetVal={function (s: string): void {
            setNewEvent({ ...newEvent, title: s });
          }}
        />
      </div>
      <div className="calendar-event-title">
        <NumberForm
          title={"Time"}
          numberValue={newEvent.time.hour}
          onSetVal={function (n: number): void {
            setNewEvent({
              ...newEvent,
              time: {
                hour: n,
                minute: newEvent.time.minute,
                isAM: newEvent.time.isAM,
              },
            });
          }}
        />
        <NumberForm
          title={" "}
          numberValue={newEvent.time.minute}
          onSetVal={function (n: number): void {
            setNewEvent({
              ...newEvent,
              time: {
                minute: n,
                hour: newEvent.time.hour,
                isAM: newEvent.time.isAM,
              },
            });
          }}
        />
        <BooleanForm
          title={"AM"}
          boolValue={newEvent.time.isAM}
          onSetVal={(b: boolean) => {
            setNewEvent({ ...newEvent, time: { ...newEvent.time, isAM: b } });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <DateForm
          title={"Date"}
          dateValue={`${eventDate.year}-${padNumberWithZeros(eventDate.month, 2)}-${padNumberWithZeros(eventDate.day, 2)}`}
          onSetVal={function (s: string): void {
            console.log(s);
            const dateArr = s.split("-");
            console.log(dateArr);
            setEventDate({
              day: Number(dateArr[2]),
              month: Number(dateArr[1]),
              year: Number(dateArr[0]),
            });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <TextForm
          title={"Location"}
          textValue={newEvent.location}
          onSetVal={function (s: string): void {
            setNewEvent({ ...newEvent, location: s });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <label>
          For:
          <select
            value={eventForIndex}
            onChange={(e) => {
              const tv = Number(e.target.value);
              console.log("New target:", tv);
              if (tv == -1) {
                if (newEvent.for) {
                  const temp: CalendarEvent = newEvent;
                  delete temp.for;

                  setNewEvent({ ...temp });
                }
                setEventForIndex(tv);
              } else {
                setNewEvent({
                  ...newEvent,
                  for: {
                    ...family.members[tv],
                  } as FamilyIndividual,
                });

                setEventForIndex(tv);
              }
            }}
          >
            {!newEvent.for && <option value={-1}>Choose...</option>}
            {family.members.map((m, i) => (
              <option key={`fm-${m.name}`} value={i}>
                {m.name}
              </option>
            ))}{" "}
          </select>
        </label>
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
      <div style={{ padding: "4px 4px" }} className="calendar-event-title">
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            borderRadius: "0px",
            background: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
      {/*<div className="calendar-event-attributes">Attributes</div>
      <div className="calendar-event-title">{newEvent.title}</div>*/}
      <div
        className="submit-button"
        //style={{ background: "white", borderRadius: "2px" }}
        onClick={() => {
          if (!newEvent.location || newEvent.location == "") {
            return console.log("assign location");
          }

          if (!newEvent.title || newEvent.title == "") {
            return console.log("assign title");
          }

          saveEditedEvent(newEvent, eventDate);
        }}
      >
        Save
      </div>
      <div className="calendar-event-attributes">
        <TextForm
          title={"Title"}
          textValue={newEvent.title}
          onSetVal={function (s: string): void {
            setNewEvent({ ...newEvent, title: s });
          }}
        />
      </div>
      <div className="calendar-event-title">
        <NumberForm
          title={"Time"}
          numberValue={newEvent.time.hour}
          onSetVal={function (n: number): void {
            setNewEvent({
              ...newEvent,
              time: {
                hour: n,
                minute: newEvent.time.minute,
                isAM: newEvent.time.isAM,
              },
            });
          }}
        />
        <NumberForm
          title={" "}
          numberValue={newEvent.time.minute}
          onSetVal={function (n: number): void {
            setNewEvent({
              ...newEvent,
              time: {
                minute: n,
                hour: newEvent.time.hour,
                isAM: newEvent.time.isAM,
              },
            });
          }}
        />
        <BooleanForm
          title={"AM"}
          boolValue={newEvent.time.isAM}
          onSetVal={(b: boolean) => {
            setNewEvent({ ...newEvent, time: { ...newEvent.time, isAM: b } });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <DateForm
          title={"Date"}
          dateValue={`${eventDate.year}-${padNumberWithZeros(eventDate.month, 2)}-${padNumberWithZeros(eventDate.day, 2)}`}
          onSetVal={function (s: string): void {
            //console.log(s);
            const dateArr = s.split("-");
            //console.log(dateArr);
            setEventDate({
              day: Number(dateArr[2]),
              month: Number(dateArr[1]),
              year: Number(dateArr[0]),
            });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <TextForm
          title={"Location"}
          textValue={newEvent.location}
          onSetVal={function (s: string): void {
            setNewEvent({ ...newEvent, location: s });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <TextForm
          title={"Notes"}
          textValue={newEvent.notes}
          onSetVal={function (s: string): void {
            setNewEvent({ ...newEvent, notes: s });
          }}
        />
      </div>
      <div className="calendar-event-attributes">
        <label>
          For:
          <select
            value={eventForIndex}
            onChange={(e) => {
              const tv = Number(e.target.value);
              //console.log("New target:", tv);
              if (tv == -1) {
                if (newEvent.for) {
                  const temp: CalendarEvent = newEvent;
                  delete temp.for;

                  setNewEvent({ ...temp });
                }
                setEventForIndex(tv);
              } else {
                setNewEvent({
                  ...newEvent,
                  for: {
                    ...family.members[tv],
                  },
                });

                setEventForIndex(tv);
              }
            }}
          >
            {!newEvent.for && <option value={-1}>Choose...</option>}
            {family.members.map((m, i) => (
              <option key={`fm-${m.name}`} value={i}>
                {m.name}
              </option>
            ))}{" "}
          </select>
        </label>
      </div>
      <div className="calendar-event-edit-drive-situation">
        <label>Select Vehicle:</label>
        <select
          value={newEvent.drivingSituation?.vehicle.id ?? -1}
          onChange={(e) => {
            if (Number(e.target.value) == -1) {
              if (newEvent.drivingSituation) {
                const temp: CalendarEvent = newEvent;
                delete temp.drivingSituation;

                setNewEvent({ ...temp });
              }
            } else {
              //console.log(e.target.value);
              setNewEvent({
                ...newEvent,
                drivingSituation: newEvent.drivingSituation
                  ? {
                      ...newEvent.drivingSituation,
                      vehicle:
                        family.vehicles?.find(
                          (v) => v.id == Number(e.target.value),
                        ) ??
                        ({
                          id: -1,
                          name: "Error getting vehicle name",
                          numPeopleCanFit: 6,
                        } as Vehicle),
                    }
                  : ({
                      driver:
                        newEvent.for && newEvent.for.canDrive
                          ? newEvent.for
                          : (family.members.find((m) => m.canDrive) ??
                            ({} as FamilyIndividual)),
                      passengers:
                        newEvent.for && !newEvent.for.canDrive
                          ? [newEvent.for]
                          : ([] as FamilyIndividual[]),
                      vehicle: family.vehicles?.find(
                        (v) => v.id == Number(e.target.value),
                      ) ?? {
                        id: -1,
                        name: "Error finding vehicle",
                        numPeopleCanFit: 8,
                      },
                    } as TransportationForEvent),
              });
            }
          }}
        >
          {!newEvent.drivingSituation && <option value={-1}>Choose...</option>}
          {family.vehicles &&
            family.vehicles.map((v) => (
              <option key={`vm-${v.name}`} value={v.id}>
                {v.name}
              </option>
            ))}{" "}
        </select>

        {newEvent.drivingSituation && (
          <div className="edit-selected-drive-situation">
            <select
              value={
                family.members.findIndex(
                  (m) => m.id == (newEvent.drivingSituation?.driver?.id ?? -1),
                ) ?? "None selected"
              }
              onChange={(e) => {
                if (Number(e.target.value) == -1) {
                  if (newEvent.drivingSituation) {
                  }
                } else {
                  setNewEvent({
                    ...newEvent,
                    drivingSituation: {
                      ...newEvent.drivingSituation,
                      driver: family.members[Number(e.target.value)],
                    } as TransportationForEvent,
                  });
                }
              }}
            >
              <option value={-1}>Choose...</option>
              {family.members.map((m, i) => {
                if (
                  m.canDrive &&
                  !newEvent.drivingSituation?.passengers.some(
                    (p) => p.id == m.id,
                  )
                ) {
                  return (
                    <option key={`vm-${m.name}`} value={i}>
                      {m.name}
                    </option>
                  );
                }
              })}{" "}
            </select>
            <div
              style={{
                //border: "2px solid red",
                height: "80%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <picture
                style={{
                  border: "1px solid black",
                  boxSizing: "border-box",
                  height: "100%",
                  display: "flex",
                }}
              >
                <img
                  src={`/car_birds_eye_img.png`}
                  alt="Edit "
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    boxSizing: "border-box",
                  }}
                />
              </picture>
              <VehiclePassengersUI
                v={newEvent.drivingSituation ?? ({} as TransportationForEvent)}
              />
            </div>
            {/* add/remove passengers */}
            <div className="edit-passengers">
              <>
                {newEvent.drivingSituation.passengers.length > 0
                  ? newEvent.drivingSituation.passengers.map((p) => {
                      return <p key={`driver name ${p.name}`}>{p.name}</p>;
                    })
                  : "Add passengers"}
                <select
                  value={passengerToAddIndex}
                  onChange={(e) => {
                    setPassengerToAddIndex(Number(e.target.value));
                  }}
                >
                  <option value="-1">Choose...</option>
                  {family.members.map((m, i) => {
                    if (
                      (newEvent.drivingSituation?.driver?.id ?? -1) != m.id &&
                      !newEvent.drivingSituation?.passengers.some(
                        (p) => p.id == m.id,
                      )
                    ) {
                      return (
                        <option key={`fm-${m.name}-p`} value={i}>
                          {m.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </>
              <div
                className="submit-button"
                onClick={() => {
                  //console.log(passengerToAddIndex);
                  if (passengerToAddIndex >= 0) {
                    //Add new passenger to driving situation
                    setNewEvent({
                      ...newEvent,
                      drivingSituation: {
                        ...newEvent.drivingSituation,
                        passengers: [
                          ...(newEvent.drivingSituation?.passengers ?? []),
                          family.members[passengerToAddIndex],
                        ],
                      } as TransportationForEvent,
                    } as CalendarEvent);
                  }
                }}
              >
                Add new passenger
              </div>
            </div>
            {/* Leaves at */}
            <div className="calendar-event-title">
              <NumberForm
                title={"Leave At"}
                numberValue={newEvent.drivingSituation.leaveAt?.hour ?? 0}
                onSetVal={(n: number) => {
                  setNewEvent({
                    ...newEvent,
                    drivingSituation: {
                      ...(newEvent.drivingSituation as TransportationForEvent),
                      leaveAt: {
                        hour: n,
                        minute: newEvent.drivingSituation?.leaveAt?.minute ?? 0,
                        isAM: newEvent.drivingSituation?.leaveAt?.isAM ?? false,
                      },
                    },
                  });
                }}
              />
              <NumberForm
                title={" "}
                numberValue={newEvent.drivingSituation.leaveAt?.minute ?? 0}
                onSetVal={function (n: number): void {
                  setNewEvent({
                    ...newEvent,
                    drivingSituation: {
                      ...(newEvent.drivingSituation as TransportationForEvent),
                      leaveAt: {
                        hour: newEvent.drivingSituation?.leaveAt?.hour ?? 0,
                        minute: n,
                        isAM: newEvent.drivingSituation?.leaveAt?.isAM ?? false,
                      },
                    },
                  });
                }}
              />
              <BooleanForm
                title={"AM"}
                boolValue={newEvent.drivingSituation.leaveAt?.isAM ?? false}
                onSetVal={(b: boolean) => {
                  setNewEvent({
                    ...newEvent,
                    drivingSituation: {
                      ...(newEvent.drivingSituation as TransportationForEvent),
                      leaveAt: {
                        hour: newEvent.drivingSituation?.leaveAt?.hour ?? 0,
                        minute: newEvent.drivingSituation?.leaveAt?.minute ?? 0,
                        isAM: b,
                      },
                    },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
