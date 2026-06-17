import { useState } from "react";
import "./NewUser.css";
import type { AuthState, FamilyIndividual } from "@shared/types";
import {
  createMemberWithFamilyID,
  createNewFamilyAPICall,
  linkUserToIndividual,
} from "../helpers/newUserAPICalls";

export default function NewUserPage({
  rh,
  logout,
}: {
  rh: AuthState;
  logout: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [colorStr, setColorStr] = useState("#3498db");
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
            onChange={() => setCreateNewFamily(!createNewFamily)}
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
        <label className="form-label">Color</label>

        <div className="color-picker-wrapper">
          <input
            type="color"
            className="color-picker"
            value={colorStr}
            onChange={(e) => setColorStr(e.target.value)}
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
            console.log("attempting to createa a new user");
            if (createNewFamily) {
              console.log("creating new family");
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
                  //colorStr: TODO: convert color to string
                } as FamilyIndividual,
                rh?.token ?? "",
              );

              if (!newIndividual) {
                console.log("error creating new individual");
                return;
              }

              //api call linking individual to current user
              await linkUserToIndividual(
                rh.user.id,
                newIndividual.id,
                rh?.token ?? "",
              );
            } else {
              console.log("adding individual to family");

              //TODO register family individual with code
              //TODO: api call linking individual to current user
            }
          }}
        >
          Create User
        </button>
      </div>
    </div>
  );
}
