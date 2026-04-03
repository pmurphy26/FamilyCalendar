import type { UIState } from "@shared/types";
import "./NavigationBar.css";

type NavigationBarProps = {
  currentState: UIState;
  setCurrentUIState: (n: UIState) => void;
};

/**
 * UI for the calendar header bar
 *
 * @param title
 * @param togglePeriod
 * @param createNewEvent
 */
export function NavigationHeaderBar({
  currentState,
  setCurrentUIState,
}: NavigationBarProps) {
  return (
    <div className="navigation-page-header">
      <div
        className={`navigation-page-selection-option${currentState == "CALENDAR" ? " selected" : ""}`}
        onClick={() => {
          setCurrentUIState("CALENDAR");
        }}
      >
        <h3
          style={{
            //border: "2px solid red",
            height: "100%",
            margin: "0px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            boxSizing: "border-box",
            padding: `${currentState == "CALENDAR" ? 5 : 10}px`,
          }}
        >
          CALENDAR
        </h3>
      </div>
      <div
        className={`navigation-page-selection-option${currentState == "EDIT" ? " selected" : ""}`}
        onClick={() => {
          setCurrentUIState("EDIT");
        }}
      >
        <h3
          style={{
            //border: "2px solid red",
            height: "100%",
            margin: "0px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            boxSizing: "border-box",
            padding: `${currentState == "CALENDAR" ? 10 : 5}px`,
          }}
        >
          FAMILY
        </h3>
      </div>
    </div>
  );
}
