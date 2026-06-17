import type {
  Calendar,
  CalendarDate,
  CalendarDay,
  CalendarEvent,
  Family,
  FamilyIndividual,
  Vehicle,
} from "@shared/types";
import { compareDates } from "./constants";

/**
 * Api call to add a new a calendar event
 *
 * @param calendarDayID calendarday event is being added to
 * @param createdEvent new calendar event
 * @param calendarInfo optional param with calendarID and calendarDate
 * fields used for finding appropraiate CalendarDay
 * @returns
 */
export async function createEvent(
  calendarDayID: number,
  createdEvent: CalendarEvent,
  authToken: string,
  calendarInfo?: { calendarID: number; calendarDate: CalendarDate },
): Promise<void> {
  //console.log("adding event to day with id:", calendarDayID);

  const res = await fetch("http://localhost:3001/api/events/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      days: [
        {
          dayID: calendarDayID,
          events: [createdEvent],
          ...(calendarDayID == -1 &&
            calendarInfo && {
              calendarInfo: calendarInfo,
            }),
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create event: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Api call to edit a calendar event
 *
 * @param editedEvent
 * @param calendarInfo optional param with calendarID and calendarDate
 * fields used for finding appropraiate CalendarDay
 * @returns
 */
export async function editEvent(
  editedEvent: CalendarEvent,
  authToken: string,
  calendarInfo?: { newCalendarDayID: number; newDate: CalendarDate },
) {
  const res = await fetch("http://localhost:3001/api/event/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      ...editedEvent,
      ...(calendarInfo && { calendarInfo: calendarInfo }),
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to edit event: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Api call to edit a transportation for event
 *
 * @param editedEvent event who's driving situation is being edited
 * @returns
 */
export async function editDrivingSituation(
  editedEvent: CalendarEvent,
  authToken: string,
) {
  const res = await fetch("http://localhost:3001/api/transportation/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      eventID: editedEvent.id,
      details: { ...editedEvent.drivingSituation },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to edit event's driving situation: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Api call to edit a transportation for event
 *
 * @param editedEvent event who's driving situation is being edited
 * @returns
 */
export async function createDrivingSituation(
  editedEvent: CalendarEvent,
  authToken: string,
) {
  const res = await fetch("http://localhost:3001/api/transportation/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      transportation: [
        {
          eventID: editedEvent.id,
          details: { ...editedEvent.drivingSituation },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to edit event's driving situation: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Make this an api call to get all of the values in the desired period
 *
 * @param newStart
 * @param newEnd
 * @returns
 */
export async function getCalendarDaysInPeriod(
  calendarID: number,
  newStart: CalendarDate,
  newEnd: CalendarDate,
  authToken: string,
) {
  const res = await fetch(`http://localhost:3001/api/days/${calendarID}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();
  //console.log(data);
  const fd = filterDaysOnPeriod(data, newStart, newEnd).sort(
    (c1: CalendarDay, c2: CalendarDay) => compareDates(c1.date, c2.date),
  );
  return fd;
}

function filterDaysOnPeriod(
  data: CalendarDay[],
  periodStart: CalendarDate,
  periodEnd: CalendarDate,
) {
  return data.filter((d: CalendarDay) => {
    return (
      compareDates(d.date, periodStart) >= 0 &&
      compareDates(d.date, periodEnd) <= 0
    );
  });
}

/*
 * API calls for editing family
 */
export async function getFamilyForIndividualWithID(
  id: number,
  authToken: string,
): Promise<Family | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/family/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to get the days in the period: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    return null;
  }
}

export async function updateIndividual(
  newIndividual: FamilyIndividual,
  authToken: string,
): Promise<FamilyIndividual> {
  const res = await fetch(`http://localhost:3001/api/familyIndividual/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(newIndividual),
  });

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

export async function deleteFamilyMemberWithID(
  id: number,
  authToken: string,
): Promise<boolean> {
  const res = await fetch(
    `http://localhost:3001/api/familyIndividual/delete/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        //   "Content-Type": "application/json",
      },
      // body: JSON.stringify({
      //   transportation: [
      //     {
      //       eventID: editedEvent.id,
      //       details: { ...editedEvent.drivingSituation },
      //     },
      //   ],
      // }),
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

/*
 * API calls for editing family vehicles
 */
export async function createFamilyVehicle(
  familyID: number,
  newVehicle: Vehicle,
  authToken: string,
): Promise<Vehicle> {
  const res = await fetch(`http://localhost:3001/api/vehicle/${familyID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(newVehicle),
  });

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

export async function updateVehicle(
  newVehicle: Vehicle,
  authToken: string,
): Promise<boolean> {
  const res = await fetch(`http://localhost:3001/api/vehicle/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(newVehicle),
  });

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

export async function deleteFamilyVehicleWithID(
  id: number,
  authToken: string,
): Promise<boolean> {
  const res = await fetch(`http://localhost:3001/api/vehicle/delete/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to get the days in the period: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

/**
 * Get calendar for family with id
 */
export async function getCalendarForFamilyWithID(
  id: number,
  authToken: string,
): Promise<Calendar | null> {
  try {
    //console.log(id);
    const res = await fetch(`http://localhost:3001/api/calendar/family/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to get the days in the period: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    return null;
  }
}
