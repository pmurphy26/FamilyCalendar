import { useEffect, useState } from "react";
import { BooleanForm, NumberForm } from "../helpers/forms";
import type {
  CalendarEvent,
  CalendarTime,
  Family,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "../../../shared/types";
import "./CalendarEvent.css";
import { ToggleUI } from "./CalendarHeader";
import { padNumberWithZeros } from "../helpers/constants";

/**
 * Creates a vehiclesituationui for a given CalendarEvent
 *
 * @param event
 * @returns
 */
export function VehicleSituationUI({ tfe }: { tfe: TransportationForEvent }) {
  return (
    <div className="calendar-event-drive-situation">
      <p style={{ height: "20%" }}>{`Vehicle: ${tfe.vehicle.name ?? ""}`}</p>

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
        <VehiclePassengersUI v={tfe} />
      </div>

      {tfe.leaveAt && (
        <div className="calendar-event-attributes">
          {`Leaves at ${tfe.leaveAt.hour}:${padNumberWithZeros(
            tfe.leaveAt.minute,
            2,
          )} ${tfe.leaveAt.isAM ? "AM" : "PM"}`}
        </div>
      )}
    </div>
  );
}

/**
 * UI element for Transportation for event
 *
 * @param v TransportationForEvent being shown in the UI
 * @returns
 */
export function VehiclePassengersUI({ v }: { v: TransportationForEvent }) {
  return (
    <div className="driver-table">
      <div
        className="driver-row"
        style={{ height: `${v.vehicle.numPeopleCanFit <= 5 ? 50 : 100 / 3}%` }}
      >
        <div
          className="driver-cell"
          style={{ background: v.driver?.name ? "#fff" : "#eee" }}
        >
          {v.driver?.name ?? "Driver"}
        </div>
        <div
          className="driver-cell"
          style={{ background: v.passengers[0]?.name ? "#fff" : "#eee" }}
        >
          {v.passengers.length > 0 ? v.passengers[0].name : "S"}
        </div>
      </div>

      <div
        className="driver-row"
        style={{ height: `${v.vehicle.numPeopleCanFit <= 5 ? 50 : 100 / 3}%` }}
      >
        <div
          className="driver-cell"
          style={{
            background:
              v.passengers.length > 1 && v.passengers[1]?.name
                ? "#fff"
                : "#eee",
          }}
        >
          {v.passengers.length > 1 ? v.passengers[1].name : "C1"}
        </div>
        <div
          className="driver-cell"
          style={{
            background:
              v.passengers.length > 2 && v.passengers[2]?.name
                ? "#fff"
                : "#eee",
          }}
        >
          {v.passengers.length > 2 ? v.passengers[2].name : "C2"}
        </div>
        {(v.vehicle.numPeopleCanFit == 5 || v.vehicle.numPeopleCanFit >= 8) && (
          <div
            className="driver-cell"
            style={{
              background:
                v.passengers.length == 5 && v.passengers[5]?.name
                  ? "#fff"
                  : "#eee",
            }}
          >
            C3
          </div>
        )}
      </div>

      {v.vehicle.numPeopleCanFit > 5 && (
        <div className="driver-row" style={{ height: `${100 / 3}%` }}>
          <div
            className="driver-cell"
            style={{
              background:
                v.passengers.length > 3 && v.passengers[3]?.name
                  ? "#fff"
                  : "#eee",
            }}
          >
            {v.passengers.length > 3 ? v.passengers[3].name : "B1"}
          </div>
          <div
            className="driver-cell"
            style={{
              background:
                v.passengers.length > 4 && v.passengers[3]?.name
                  ? "#fff"
                  : "#eee",
            }}
          >
            {v.passengers.length > 4 ? v.passengers[4].name : "B2"}
          </div>
          <div
            className="driver-cell"
            style={{
              background:
                v.passengers.length > 5 && v.passengers[3]?.name
                  ? "#fff"
                  : "#eee",
            }}
          >
            {v.passengers.length > 5 ? v.passengers[5].name : "B3"}
          </div>
        </div>
      )}
    </div>
  );
}

export function SelectVehicleUI({
  newEvent,
  family,
  passengerToAddIndex,
  setNewEvent,
  setPassengerToAddIndex,
}: {
  newEvent: CalendarEvent;
  family: Family;
  passengerToAddIndex: number;
  setNewEvent: (newEvent: CalendarEvent) => void;
  setPassengerToAddIndex: (newIndex: number) => void;
}) {
  const [curr, setCurr] = useState<"LEFT" | "RIGHT">("LEFT");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const activeKey = curr == "LEFT" ? "departure" : "arrival";

  const [includeLeaveAt, setIncludeLeaveAt] = useState<boolean>(
    !!newEvent.drivingSituation?.[activeKey]?.leaveAt,
  );
  const [leaveAtTime, setLeaveAtTime] = useState<CalendarTime>({
    hour: newEvent.drivingSituation?.[activeKey]?.leaveAt?.hour ?? 12,
    minute: newEvent.drivingSituation?.[activeKey]?.leaveAt?.minute ?? 0,
    isAM: newEvent.drivingSituation?.[activeKey]?.leaveAt?.isAM ?? false,
  });

  useEffect(() => {
    console.log(activeKey);
  }, [activeKey]);

  return (
    <div className="calendar-event-edit-drive-situation">
      <div className="vehicle-header">
        <span className="vehicle-label">Select Vehicle:</span>

        <button
          className="vehicle-toggle-btn"
          onClick={() => {
            //TODO: set according departure or arrival
            setCollapsed(!collapsed);
          }}
        >
          {collapsed ? "＋" : "−"}
        </button>
      </div>

      {!collapsed && (
        <>
          <ToggleUI
            val1={"Dropoff"}
            val2={"Pickup"}
            curr={curr}
            onToggle={() => {
              setCurr(curr == "RIGHT" ? "LEFT" : "RIGHT");
            }}
          />

          <select
            value={newEvent.drivingSituation?.[activeKey]?.vehicle.id ?? -1}
            onChange={(e) => {
              const id = Number(e.target.value);

              //REMOVE DRIVING SITUATION
              if (id == -1) {
                const temp = { ...newEvent };

                if (temp.drivingSituation?.[activeKey]) {
                  temp.drivingSituation = { ...temp.drivingSituation };
                  delete temp.drivingSituation[activeKey];
                }

                setNewEvent(temp);
                return;
              }
              //UPDATE DRIVING SITUATION
              const existingDrivingSituation =
                newEvent.drivingSituation?.[activeKey];

              const updatedDrivingSituation: TransportationForEvent =
                existingDrivingSituation
                  ? {
                      ...existingDrivingSituation,
                      vehicle:
                        family.vehicles?.find((v) => v.id == id) ??
                        ({
                          id: -1,
                          name: "Error getting vehicle name",
                          numPeopleCanFit: 6,
                        } as Vehicle),
                    }
                  : {
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
                    };

              //UPDATE EVENT
              setNewEvent({
                ...newEvent,
                drivingSituation: {
                  ...newEvent.drivingSituation,
                  [activeKey]: updatedDrivingSituation,
                },
              });
            }}
          >
            {!newEvent.drivingSituation?.[activeKey] && (
              <option value={-1}>Choose...</option>
            )}
            {family.vehicles?.map((v) => (
              <option key={`vm-${v.name}`} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {newEvent.drivingSituation?.[activeKey] && (
            <div className="edit-selected-drive-situation">
              <select
                value={
                  family.members.findIndex(
                    (m) =>
                      m.id ==
                      (newEvent.drivingSituation?.[activeKey]?.driver?.id ??
                        -1),
                  ) ?? "None selected"
                }
                onChange={(e) => {
                  if (Number(e.target.value) == -1) {
                    if (newEvent.drivingSituation?.[activeKey]) {
                    }
                  } else {
                    setNewEvent({
                      ...newEvent,
                      drivingSituation: {
                        [activeKey]: {
                          ...newEvent.drivingSituation?.[activeKey],
                          driver: family.members[Number(e.target.value)],
                        } as TransportationForEvent,
                      },
                    });
                  }
                }}
              >
                <option value={-1}>Choose...</option>
                {family.members.map((m, i) => {
                  if (
                    m.canDrive &&
                    !newEvent.drivingSituation?.[activeKey]?.passengers.some(
                      (p) => p.id == m.id,
                    )
                  ) {
                    return (
                      <option key={`vm-${m.name}`} value={i}>
                        {m.name}
                      </option>
                    );
                  }
                })}
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
                  v={
                    newEvent.drivingSituation?.[activeKey] ??
                    ({} as TransportationForEvent)
                  }
                />
              </div>
              {/* add/remove passengers */}
              <div className="edit-passengers">
                <>
                  {(newEvent.drivingSituation?.[activeKey]?.passengers.length ??
                  0 > 0)
                    ? newEvent.drivingSituation?.[activeKey]?.passengers.map(
                        (p) => {
                          return <p key={`driver name ${p.name}`}>{p.name}</p>;
                        },
                      )
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
                        (newEvent.drivingSituation?.[activeKey]?.driver?.id ??
                          -1) != m.id &&
                        !newEvent.drivingSituation?.[
                          activeKey
                        ]?.passengers.some((p) => p.id == m.id)
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
                    console.log(
                      `Adding passenger with index: ${passengerToAddIndex}`,
                    );
                    if (passengerToAddIndex >= 0) {
                      //Add new passenger to driving situation
                      setNewEvent({
                        ...newEvent,
                        drivingSituation: {
                          ...newEvent.drivingSituation,
                          [activeKey]: {
                            ...newEvent.drivingSituation?.[activeKey],
                            passengers: [
                              ...(newEvent.drivingSituation?.[activeKey]
                                ?.passengers ?? []),
                              family.members[passengerToAddIndex],
                            ],
                          },
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
                <BooleanForm
                  title={"Include leave at time"}
                  boolValue={includeLeaveAt}
                  onSetVal={(b: boolean) => {
                    setIncludeLeaveAt(b);
                  }}
                />
              </div>
              {includeLeaveAt && (
                <div className="calendar-event-section">
                  <div className="section-label">Leave at Time</div>
                  <div className="time-row">
                    <NumberForm
                      title="Hour"
                      numberValue={leaveAtTime.hour}
                      onSetVal={(n) => {
                        setLeaveAtTime({
                          ...leaveAtTime,
                          hour: n,
                        });
                        setNewEvent({
                          ...newEvent,
                          drivingSituation: {
                            ...newEvent.drivingSituation,
                            [activeKey]: {
                              ...newEvent.drivingSituation?.[activeKey],
                              leaveAt: {
                                ...{
                                  ...leaveAtTime,
                                  hour: n,
                                },
                              },
                            },
                          },
                        });
                      }}
                    />
                    <NumberForm
                      title="Min"
                      numberValue={leaveAtTime.minute}
                      onSetVal={(n) => {
                        setLeaveAtTime({ ...leaveAtTime, minute: n });
                        setNewEvent({
                          ...newEvent,
                          drivingSituation: {
                            ...newEvent.drivingSituation,
                            [activeKey]: {
                              ...newEvent.drivingSituation?.[activeKey],
                              leaveAt: {
                                ...{
                                  ...leaveAtTime,
                                  minute: n,
                                },
                              },
                            },
                          },
                        });
                      }}
                    />
                    <BooleanForm
                      title="AM"
                      boolValue={leaveAtTime.isAM}
                      onSetVal={(b) => {
                        setLeaveAtTime({ ...leaveAtTime, isAM: b });
                        setNewEvent({
                          ...newEvent,
                          drivingSituation: {
                            ...newEvent.drivingSituation,
                            [activeKey]: {
                              ...newEvent.drivingSituation?.[activeKey],
                              leaveAt: {
                                ...{
                                  ...leaveAtTime,
                                  isAM: b,
                                },
                              },
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
