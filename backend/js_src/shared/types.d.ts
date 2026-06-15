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
};
export type CalendarDate = {
    day: number;
    month: number;
    year: number;
};
export type FamilyIndividualRoles = "MOM" | "DAD" | "GRANDPARENT" | "CHILD" | "OTHER" | "PARENT";
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
export type AuthUser = {
    id: number;
    username: string;
    familyIndividualID: number | null;
};
export type AuthState = {
    user: AuthUser | null;
    token: string | null;
};
export declare function loadAuthState(): AuthState;
export declare function saveAuthState(state: AuthState): void;
export declare function clearAuthState(): void;
