import { useState } from "react";
import { padNumberWithZeros } from "../helpers/constants";
import type { CalendarEvent } from "../../../shared/types";
import "./CalendarEvent.css";
import { ToggleUI } from "./CalendarHeader";
import { VehicleSituationUI } from "./VehicleSituation";

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
