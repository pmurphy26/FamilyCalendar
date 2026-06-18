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
  startTime: CalendarTime;
  endTime: CalendarTime;
  title: string;
  notes: string;
  createdBy: FamilyIndividual;
  for?: FamilyIndividual;
  drivingSituation?: {
    arrival?: TransportationForEvent;
    departure?: TransportationForEvent;
  };
};

export type Family = {
  id: number;
  members: FamilyIndividual[];
  vehicles?: Vehicle[];
  code?: string;
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

// Auth and user login stuff
export type AuthUser = {
  id: number;
  username: string;
  familyIndividualID: number | null;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

const STORAGE_KEY = "rushHourAuth";

export function loadAuthState(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, token: null };
  try {
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

export function saveAuthState(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY);
}

export type CreationPeriod = "SINGLE" | "WEEKLY" | "MONTHLY";
