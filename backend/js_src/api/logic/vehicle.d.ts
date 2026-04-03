import { Vehicle } from "@shared/types";
export declare function getVehicleWithID(id: number): Promise<Vehicle>;
export declare function createVehicleForFamily(familyID: number, newVehicle: Vehicle): Promise<Vehicle>;
export declare function deleteVehicleWithID(id: number): Promise<boolean>;
export declare function updateVehicle(fv: Vehicle): Promise<boolean>;
