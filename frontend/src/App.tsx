import { useEffect, useState } from "react";
import "./App.css";
import type { Family, FamilyIndividual, UIState } from "@shared/types";
import {
  deleteFamilyMemberWithID,
  getFamilyForIndividualWithID,
} from "./helpers.ts/apiCalls";
import { CalendarUI } from "./UIAssets/CalendarUI";
import { NavigationHeaderBar } from "./UIAssets/NavigationBar";
import { EditFamilyUI } from "./UIAssets/EditFamilyUI";

/**
 * Main application UI
 */
function App() {
  const userID: number = 0; //TODO: Create some sort of login system to make this dynamic
  const [myFamily, setMyFamily] = useState<Family>({} as Family);
  const [currentUIState, setCurrentUIState] = useState<UIState>("CALENDAR");

  useEffect(() => {
    const fetchFamily = async () => {
      const userFamily = await getFamilyForIndividualWithID(userID);
      setMyFamily(userFamily);
    };

    if (userID >= 0) {
      fetchFamily();
    }
  }, [userID]);

  async function deleteFamilyIndividual(id: number) {
    //const successfulDelete =
    await deleteFamilyMemberWithID(id);

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
        <CalendarUI calendarID={0} myFamily={myFamily} />
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
        />
      )}
    </div>
  );
}

export default App;
