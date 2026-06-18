import { padNumberWithZeros } from "./constants";

export function TextForm({
  title,
  textValue,
  onSetVal,
}: {
  title: string;
  textValue: string;
  onSetVal: (s: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* String input */}
      <div>
        <label>
          {title}:
          <input
            type="text"
            value={textValue}
            onChange={(e) => onSetVal(e.target.value)}
          />
        </label>
        {/*<div>Saved text: {textValue}</div>*/}
      </div>
    </div>
  );
}

export function NumberForm({
  title,
  numberValue,
  onSetVal,
}: {
  title?: string;
  numberValue: number;
  onSetVal: (n: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
        /*padding: "0.5rem",
          border: "2px solid green",*/
        gap: "10px",
      }}
    >
      {/* Number input */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          boxSizing: "border-box",
          flexShrink: 1,
          width: "auto",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.25rem",
            whiteSpace: "nowrap",
          }}
        >
          {title ? `${title}:` : ""}

          <input
            type="number"
            value={padNumberWithZeros(numberValue, 2)}
            onChange={(e) =>
              onSetVal(e.target.value === "" ? 0 : Number(e.target.value))
            }
            style={{
              boxSizing: "border-box",
              width: "4rem",
            }}
          />
        </label>
      </div>
    </div>
  );
}

export function DateForm({
  title,
  dateValue,
  onSetVal,
}: {
  title: string;
  dateValue: string;
  onSetVal: (s: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Date input */}
      <div>
        <label>
          {`${title}: `}
          <input
            type="date"
            value={dateValue}
            onChange={(e) => onSetVal(e.target.value)}
          />
        </label>
        {/*<div>Saved date: {dateValue || "—"}</div>*/}
      </div>
    </div>
  );
}

export function BooleanForm({
  title,
  boolValue,
  onSetVal,
}: {
  title: string;
  boolValue: boolean;
  onSetVal: (b: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        //border: "2px solid green",
      }}
    >
      {/* Boolean input */}
      <div>
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={boolValue}
            onChange={() => onSetVal(!boolValue)}
          />
          {title}
        </label>
      </div>
    </div>
  );
}
