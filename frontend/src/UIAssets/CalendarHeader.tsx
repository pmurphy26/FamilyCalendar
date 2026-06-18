import { useEffect, useRef, useState } from "react";
import "./Calendar.css";
import "./Toggle.css";
import { monthNumToString } from "../helpers/constants";
import type { CalendarDate, CreationPeriod } from "../../../shared/types";

/**
 * UI for the calendar header bar
 * contains the create button and the week/month period selector
 *
 * @param title
 * @param togglePeriod
 * @param createNewEvent
 */
export function CalendarHeaderBar({
  selectedDate,
  selectedPeriod,
  togglePeriod,
  createNewEvent,
}: {
  selectedDate: CalendarDate;
  selectedPeriod: "MONTH" | "WEEK";
  togglePeriod: () => void;
  createNewEvent: (t: CreationPeriod) => void;
}) {
  const [curr, setCurr] = useState<"LEFT" | "RIGHT">(
    selectedPeriod == "MONTH" ? "RIGHT" : "LEFT",
  );
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="calendar-page-header">
      <div
        className="calendar-event-title"
        style={{ width: "70%", height: "100%", padding: "0px 20px" }}
      >
        <button
          ref={buttonRef}
          className="create-btn"
          onClick={() => {
            setOpen((o) => !o);
          }}
        >
          <span className="plus">+</span>
          Create
        </button>

        {open && (
          <div className="create-dropdown" ref={dropdownRef}>
            <div
              className="dropdown-item"
              onClick={() => {
                createNewEvent("SINGLE");
                setOpen(false);
              }}
            >
              Single Event
            </div>

            <div
              className="dropdown-item"
              onClick={() => {
                createNewEvent("WEEKLY");
                setOpen(false);
              }}
            >
              Weekly Event
            </div>

            <div
              className="dropdown-item"
              onClick={() => {
                createNewEvent("MONTHLY");
                setOpen(false);
              }}
            >
              Monthly Event
            </div>
          </div>
        )}

        <ToggleUI
          val1={"WEEK"}
          val2={"MONTH"}
          curr={curr}
          onToggle={() => {
            togglePeriod();

            setCurr(curr == "RIGHT" ? "LEFT" : "RIGHT");
          }}
        />
      </div>

      <h3
        style={{
          borderLeft: "2px solid #4a90e2",
          borderRight: "2px solid #4a90e2",
          background: "#e6f0ff",
          height: "100%",
          margin: "0px",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          boxSizing: "border-box",
          padding: "4px",
        }}
      >
        {`${monthNumToString[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}
      </h3>
    </div>
  );
}

export function ToggleUI({
  val1,
  val2,
  curr,
  onToggle,
}: {
  val1: any;
  val2: any;
  curr: "LEFT" | "RIGHT";
  onToggle: () => void;
}) {
  const selected = curr;

  return (
    <div className="toggle-container">
      <div className={`toggle-slider ${selected === "RIGHT" ? "right" : ""}`} />

      <button
        className={selected === "LEFT" ? "active" : ""}
        onClick={() => onToggle()}
      >
        {val1}
      </button>

      <button
        className={selected === "RIGHT" ? "active" : ""}
        onClick={() => onToggle()}
      >
        {val2}
      </button>
    </div>
  );
}
