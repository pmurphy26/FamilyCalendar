import { useState } from "react";
import "./NewUser.css";
import { type AuthState, type FamilyIndividual } from "../../../shared/types";
import {
  createMemberWithFamilyCode,
  createMemberWithFamilyID,
  createNewFamilyAPICall,
  linkUserToIndividual,
} from "../helpers/newUserAPICalls";

export default function NewUserPage({
  rh,
  logout,
  setAuth,
}: {
  rh: AuthState;
  logout: () => void;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [colorStr, setColorStr] = useState("#000000"); //"#3498db");
  const [canDrive, setCanDrive] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(true);

  const [createNewFamily, setCreateNewFamily] = useState<boolean>(true);
  const [familyCode, setFamilyCode] = useState("");

  return (
    <div className="page-container">
      <h1 className="page-title">Create New User</h1>

      <div className="form-card">
        {/* First Name */}
        <label className="form-label">First Name</label>
        <input
          className="form-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
        />

        {/* Last Name */}
        <label className="form-label">Last Name</label>
        <input
          className="form-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
        />

        {/* Create New Family Checkbox */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={createNewFamily}
            onChange={() => {
              setCreateNewFamily(!createNewFamily);
              setCanEdit(!canEdit);
            }}
          />
          <span>Create New Family</span>
        </div>

        {/* Family Code */}
        {!createNewFamily && (
          <>
            <label className="form-label">Family Code</label>
            <input
              className="form-input"
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value)}
              placeholder="Enter family code"
            />
          </>
        )}

        {/* Color String */}
        <label className="form-label">User's Color</label>

        <div className="color-picker-wrapper">
          <input
            type="color"
            className="color-picker"
            value={colorStr}
            onChange={(e) => {
              setColorStr(e.target.value);
            }}
          />
        </div>

        {/* Can Drive */}
        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={canDrive}
            onChange={() => setCanDrive(!canDrive)}
          />
          <span>Can Drive</span>
        </div>

        <button
          className="cancel-btn"
          onClick={() => {
            //console.log("attempting to logout");
            logout();
          }}
        >
          Cancel
        </button>

        {/* Submit Button */}
        <button
          className="submit-btn"
          onClick={async () => {
            if (createNewFamily) {
              //console.log("creating new family");
              if (!rh.user?.id) {
                return;
              }

              //api call for creating new family
              const newFamily = await createNewFamilyAPICall(rh?.token ?? "");

              if (!newFamily) {
                return;
              }
              if (!newFamily.id) {
                console.log(`New family is missing id field`);
                return;
              }

              //api call to create new individual
              const newIndividual = await createMemberWithFamilyID(
                newFamily.id,
                {
                  role: "CHILD",
                  name: `${firstName} ${lastName}`,
                  canDrive: canDrive,
                  canEditCalendar: canEdit,
                  colorStr: colorStr,
                } as FamilyIndividual,
                rh?.token ?? "",
              );

              if (!newIndividual) {
                console.log("error creating new individual");
                return;
              }

              //api call linking individual to current user
              const linkSuccess = await linkUserToIndividual(
                rh.user.id,
                newIndividual.id,
                rh?.token ?? "",
              );

              if (!linkSuccess) {
                console.log("error linking user to new individual");
                return;
              }

              setAuth({
                ...rh,
                user: {
                  ...rh.user,
                  familyIndividualID: newIndividual.id,
                },
              });
            } else {
              //console.log("adding individual to family");
              if (!familyCode) {
                console.log("must have family code");
                return;
              }
              if (!rh.user?.id) {
                return;
              }

              //register family individual with code
              const newIndividual = await createMemberWithFamilyCode(
                familyCode,
                {
                  role: "CHILD",
                  name: `${firstName} ${lastName}`,
                  canDrive: canDrive,
                  canEditCalendar: canEdit,
                  colorStr: colorStr,
                } as FamilyIndividual,
                rh?.token ?? "",
              );

              //api call linking individual to current user
              if (!newIndividual) {
                console.log("error creating new individual");
                return;
              }

              //api call linking individual to current user
              const linkSuccess = await linkUserToIndividual(
                rh.user.id,
                newIndividual.id,
                rh?.token ?? "",
              );

              if (!linkSuccess) {
                console.log("error linking user to new individual");
                return;
              }

              setAuth({
                ...rh,
                user: {
                  ...rh.user,
                  familyIndividualID: newIndividual.id,
                },
              });
            }
          }}
        >
          Create User
        </button>
      </div>
    </div>
  );
}
