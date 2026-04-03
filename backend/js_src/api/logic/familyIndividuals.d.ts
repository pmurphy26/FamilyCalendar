import { FamilyIndividual } from "@shared/types";
export declare function getFamilyIndividualWithID(id: number): Promise<FamilyIndividual>;
export declare function createIndividualForFamily(familyID: number, newIndividual: FamilyIndividual): Promise<FamilyIndividual>;
export declare function deleteIndividualWithID(id: number): Promise<boolean>;
export declare function updateIndividual(fi: FamilyIndividual): Promise<boolean>;
