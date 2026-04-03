import { Family, FamilyIndividual, Vehicle } from "@shared/types";
export declare function getFamilyForIndividualWithID(id: number): Promise<Family>;
export declare function getAllFamilyVehiclesWithID(id: number): Promise<Vehicle[]>;
export declare function getAllFamilyMembersWithID(id: number): Promise<FamilyIndividual[]>;
