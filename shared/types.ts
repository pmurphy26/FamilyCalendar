export type Calendar = {
  calendarName: string;
  calendarID: number;
};

export type CalendarDay = {
  id?: number;
  date: CalendarDate;
  events: CalendarEvent[];
};

export type CalendarEvent = {
  id: number;
  location: string;
  time: CalendarTime;
  title: string;
  notes: string;
  createdBy: FamilyIndividual;
  for?: FamilyIndividual;
  drivingSituation?: TransportationForEvent;
};

export type Family = {
  id: number;
  members: FamilyIndividual[];
  vehicles?: Vehicle[];
};

export type CalendarDate = {
  day: number;
  month: number;
  year: number;
};

export type FamilyIndividualRoles =
  | "MOM"
  | "DAD"
  | "GRANDPARENT"
  | "CHILD"
  | "OTHER"
  | "PARENT";

export type FamilyIndividual = {
  id: number;
  role: FamilyIndividualRoles;
  name: string;
  canDrive: boolean;
  canEditCalendar: boolean;
  imageStr?: string;
  colorStr?: string;
};

export type TransportationForEvent = {
  driver?: FamilyIndividual;
  passengers: FamilyIndividual[];
  vehicle: Vehicle;
  leaveAt?: CalendarTime;
  //type: "PICK UP" | "DROP OFF" | "OTHER";
};

export type Vehicle = {
  id: number;
  name: string;
  numPeopleCanFit: number;
};

export type CalendarTime = {
  hour: number;
  minute: number;
  isAM: boolean;
};

export type UIState = "CALENDAR" | "EDIT";
