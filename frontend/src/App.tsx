import { useEffect, useState } from "react";
import "./App.css";
import type {
  AuthState,
  Family,
  FamilyIndividual,
  UIState,
} from "@shared/types";
import {
  deleteFamilyMemberWithID,
  getFamilyForIndividualWithID,
} from "./helpers/apiCalls";
import { CalendarUI } from "./UIAssets/CalendarUI";
import { NavigationHeaderBar } from "./UIAssets/NavigationBar";
import { EditFamilyUI } from "./UIAssets/EditFamilyUI";

/**
 * Main application UI
 */
export function CalendarApp({
  rh,
  logout,
}: {
  rh: AuthState;
  logout: () => void;
}) {
  const userID: number = rh.user?.familyIndividualID ?? -1; //TODO: Create some sort of login system to make this dynamic
  const [myFamily, setMyFamily] = useState<Family>({} as Family);
  const [currentUIState, setCurrentUIState] = useState<UIState>("CALENDAR");

  useEffect(() => {
    const fetchFamily = async () => {
      const userFamily = await getFamilyForIndividualWithID(
        userID,
        rh?.token ?? "",
      );
      setMyFamily(userFamily);
    };

    if (userID >= 0) {
      fetchFamily();
    }
  }, [userID]);

  async function deleteFamilyIndividual(id: number) {
    //const successfulDelete =
    await deleteFamilyMemberWithID(id, rh?.token ?? "");

    //console.log(successfulDelete);
  }

  /**
   * Main UI
   */
  return (
    <div className="page-container">
      <NavigationHeaderBar
        currentState={currentUIState}
        setCurrentUIState={(n: UIState) => {
          setCurrentUIState(n);
        }}
      />
      {currentUIState == "CALENDAR" && (
        <CalendarUI calendarID={0} myFamily={myFamily} rh={rh} />
      )}
      {currentUIState == "EDIT" && (
        <EditFamilyUI
          userFamily={myFamily}
          onUpdate={(nf: Family) => {
            //console.log(nf);
            setMyFamily(nf);
          }}
          onDelete={async (fi: FamilyIndividual) => {
            //console.log(fi);
            setMyFamily({
              ...myFamily,
              members: myFamily.members.filter((m) => m.id != fi.id),
            });

            //backend call to delete
            await deleteFamilyIndividual(fi.id);
          }}
          rh={rh}
          logout={logout}
        />
      )}
    </div>
  );
}

export default CalendarApp;
