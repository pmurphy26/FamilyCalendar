import type {
  CalendarEvent,
  TransportationForEvent,
  Family,
  FamilyIndividual,
  Vehicle,
  CalendarTime,
} from "../../../shared/types";

export const minivan: Vehicle = {
  name: "The minivan",
  numPeopleCanFit: 8,
  id: 1,
};

export const mockFamilyIndividuals: FamilyIndividual[] = [
  {
    id: 0,
    role: "PARENT",
    name: "Mom",
    canDrive: true,
    canEditCalendar: true,
  } as FamilyIndividual,
  {
    id: 1,
    role: "PARENT",
    name: "Dad",
    canDrive: true,
    canEditCalendar: false,
  } as FamilyIndividual,
  {
    id: 2,
    role: "CHILD",
    name: "Peter",
    canDrive: true,
    canEditCalendar: true,
  } as FamilyIndividual,
  {
    id: 3,
    role: "CHILD",
    name: "Brendan",
    canDrive: false,
    canEditCalendar: false,
  } as FamilyIndividual,
  {
    id: 4,
    role: "CHILD",
    name: "Timmy",
    canDrive: false,
    canEditCalendar: false,
  } as FamilyIndividual,
  {
    id: 5,
    role: "CHILD",
    name: "Kevin",
    canDrive: false,
    canEditCalendar: false,
    colorStr: "#4a90e2",
  } as FamilyIndividual,
];

export const mockEvent: CalendarEvent = {
  id: 0,
  time: { hour: 4, minute: 0, isAM: false },
  title: "Club Practice",
  location: "NEFC complex",
  for: mockFamilyIndividuals[5],
  notes: "",
  createdBy: mockFamilyIndividuals[0],
  drivingSituation: {
    driver: mockFamilyIndividuals[0],
    vehicle: {
      name: "The minivan",
      numPeopleCanFit: 8,
    } as Vehicle,
    leaveAt: { hour: 3, minute: 20, isAM: false } as CalendarTime,
    passengers: [mockFamilyIndividuals[5]] as FamilyIndividual[],
    type: "PICK UP",
  } as TransportationForEvent,
};

export const mockFamily: Family = {
  id: 0,
  members: [...mockFamilyIndividuals],
  vehicles: [minivan],
};

export const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    time: { hour: 2, minute: 30, isAM: false },
    title: "School",
    location: "Annie Sullivan",
    for: { name: "Kevin", colorStr: "#4a90e2" } as FamilyIndividual,
    notes: "",
    createdBy: mockFamilyIndividuals[0],
    drivingSituation: {
      driver: mockFamilyIndividuals[0],
      vehicle: {
        name: "Palisade",
        numPeopleCanFit: 5,
      } as Vehicle,
      passengers: [] as FamilyIndividual[],
    } as TransportationForEvent,
  },
  mockEvent,
];
