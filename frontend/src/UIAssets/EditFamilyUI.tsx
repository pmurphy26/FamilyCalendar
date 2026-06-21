import type {
  FamilyIndividualRoles,
  Family,
  FamilyIndividual,
  Vehicle,
  AuthState,
} from "@shared/types";
import "./EditFamilyUI.css";
import { BooleanForm, NumberForm, TextForm } from "../helpers/forms";
import { useState } from "react";
import {
  createFamilyVehicle,
  deleteFamilyVehicleWithID,
  updateIndividual,
  updateVehicle,
} from "../helpers/apiCalls";
import "./logoutBar.css";
import { createMemberWithFamilyID } from "../helpers/newUserAPICalls";

export function EditFamilyUI({
  userFamily,
  onUpdate,
  onDelete,
  rh,
  logout,
}: {
  userFamily: Family;
  onUpdate: (nf: Family) => void; //only updates the ui
  onDelete: (fi: FamilyIndividual) => void;
  rh: AuthState;
  logout: () => void;
}) {
  return (
    <div className="edit-family-container">
      <LogoutBar
        familyCode={userFamily?.code ?? "Error getting code"}
        username={rh.user?.username ?? "Unknown"}
        logout={logout}
      />
      <EditFamilyMembersUI
        familyIndividualID={rh.user?.familyIndividualID ?? -1}
        familyMembers={userFamily.members}
        onUpdate={async (cmb: FamilyIndividual) => {
          try {
            const umb = await updateIndividual(cmb, rh?.token ?? "");

            onUpdate({
              ...userFamily,
              members: userFamily.members.map((fm) => {
                if (cmb.id == fm.id && umb) {
                  return cmb;
                }
                return fm;
              }),
            });
          } catch (error) {
            console.log(error);
          }
        }}
        onDelete={(individualToDelete: FamilyIndividual) => {
          onDelete(individualToDelete);
        }}
        onCreate={async (newIndividual: FamilyIndividual) => {
          try {
            const res: FamilyIndividual | null = await createMemberWithFamilyID(
              userFamily.id,
              newIndividual,
              rh?.token ?? "",
            );
            //console.log("Res:", res);
            if (!res) {
              console.log("error creating new individual");
              return;
            }

            onUpdate({
              ...userFamily,
              members: [...userFamily.members, res],
            });
          } catch (error) {
            console.log(error);
          }
        }}
      />
      <EditFamilyVehiclesUI
        familyVehicles={userFamily?.vehicles ?? []}
        onUpdate={async (cv: Vehicle) => {
          const su = await updateVehicle(cv, rh?.token ?? "");
          onUpdate({
            ...userFamily,
            vehicles: (userFamily?.vehicles ?? []).map((fv) => {
              if (cv.id == fv.id && su) {
                return cv;
              }
              return fv;
            }),
          });
        }}
        onDelete={function (fv: Vehicle): void {
          //const sd =
          deleteFamilyVehicleWithID(fv.id, rh?.token ?? "");
          //console.log(sd);
          onUpdate({
            ...userFamily,
            vehicles: [
              ...(userFamily?.vehicles ?? []).filter((v) => v.id != fv.id),
            ],
          });
        }}
        onCreate={async (fv: Vehicle) => {
          const nv = await createFamilyVehicle(
            userFamily.id,
            fv,
            rh?.token ?? "",
          );
          onUpdate({
            ...userFamily,
            vehicles: [...(userFamily?.vehicles ?? []), nv],
          });
        }}
      />
    </div>
  );
}

export function LogoutBar({
  familyCode,
  username,
  logout,
}: {
  familyCode: string;
  username: string;
  logout: () => void;
}) {
  return (
    <div className="logout-bar">
      <div className="family-code-container">
        <span className="family-code-text">{familyCode}</span>
        <button
          className="family-code-copy-btn"
          onClick={() => navigator.clipboard.writeText(familyCode)}
        >
          Copy
        </button>
      </div>

      <div className="logout-right">
        <div className="logout-user">
          Logged in as <b>{username}</b>
        </div>
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export function EditFamilyMembersUI({
  familyIndividualID,
  familyMembers,
  onUpdate,
  onDelete,
  onCreate,
}: {
  familyIndividualID: number;
  familyMembers: FamilyIndividual[];
  onUpdate: (cmb: FamilyIndividual) => void;
  onDelete: (fi: FamilyIndividual) => void;
  onCreate: (fi: FamilyIndividual) => void;
}) {
  const [creatingNewMember, setCreatingNewMember] = useState<boolean>(false);
  return (
    <div className="edit-family-members">
      <div
        className="edit-family-member-button-container"
        style={{ width: "100%", padding: "10px 4px" }}
      >
        <h3 style={{ margin: 0 }}>{`Family Members`}</h3>

        {!creatingNewMember && (
          <div
            className="edit-family-member-button-container"
            style={{ width: "25%" }}
          >
            <div
              className="edit-family-member-button"
              onClick={() => {
                setCreatingNewMember(true);
              }}
            >{`Create`}</div>
          </div>
        )}
        {creatingNewMember && (
          <div
            className="edit-family-member-button-container"
            style={{ width: "25%" }}
          >
            <div
              className="edit-family-member-button-confirm"
              onClick={() => {
                setCreatingNewMember(false);
              }}
            >{`Cancel`}</div>
          </div>
        )}
      </div>

      <div className="edit-family-member-container">
        {familyMembers.map((fm) => {
          return (
            <EditFamilyMember
              key={`fmc-${fm.id}`}
              fm={fm}
              canChangeEdit={fm.id != familyIndividualID}
              onUpdate={function (cm: FamilyIndividual): void {
                //console.log(cm);
                onUpdate(cm);
              }}
              onDelete={function (cm: FamilyIndividual): void {
                //console.log(cm);
                onDelete(cm);
              }}
            />
          );
        })}

        {creatingNewMember && (
          <CreateFamilyMember
            fm={{
              id: -1,
              role: "CHILD",
              name: "",
              canDrive: false,
              canEditCalendar: false,
              imageStr: undefined,
              colorStr: undefined,
            }}
            onCreate={function (cm: FamilyIndividual): void {
              //console.log(cm);
              onCreate(cm);
              setCreatingNewMember(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditFamilyMember({
  fm,
  canChangeEdit,
  onUpdate,
  onDelete,
}: {
  fm: FamilyIndividual;
  canChangeEdit: boolean;
  onUpdate: (cm: FamilyIndividual) => void;
  onDelete: (cm: FamilyIndividual) => void;
}) {
  const [currentMember, setCurrentMember] = useState<FamilyIndividual>(fm);

  return (
    <div className="edit-family-member">
      <div className="edit-family-member-element" style={{ width: "25%" }}>
        <TextForm
          title={"Name"}
          textValue={currentMember.name}
          onSetVal={(s: string) => {
            setCurrentMember({ ...currentMember, name: s });
          }}
        />
      </div>
      <div className="edit-family-member-element" style={{ width: "10%" }}>
        <select
          value={currentMember.role}
          onChange={(e) => {
            setCurrentMember({
              ...currentMember,
              role: e.target.value as FamilyIndividualRoles,
            });
          }}
          style={{ width: "100%" }}
        >
          {["MOM", "DAD", "GRANDPARENT", "CHILD", "OTHER", "PARENT"].map(
            (r) => {
              r;
              return (
                <option key={`cr-${r}`} value={r}>
                  {r}
                </option>
              );
            },
          )}
        </select>
      </div>
      <div className="edit-family-member-element" style={{ width: "10%" }}>
        <BooleanForm
          title={`Can Drive`}
          boolValue={currentMember.canDrive}
          onSetVal={function (b: boolean): void {
            setCurrentMember({ ...currentMember, canDrive: b });
          }}
        />
      </div>

      <div className="edit-family-member-element" style={{ width: "10%" }}>
        {canChangeEdit ? (
          <BooleanForm
            title={`Can Edit`}
            boolValue={currentMember.canEditCalendar}
            onSetVal={function (b: boolean): void {
              setCurrentMember({ ...currentMember, canEditCalendar: b });
            }}
          />
        ) : (
          <div style={{ height: "100%" }}></div> // blank placeholder
        )}
      </div>
      <div className="edit-family-member-element" style={{ width: "20%" }}>
        <TextForm
          title={`Color`}
          textValue={currentMember?.colorStr ?? ""}
          onSetVal={function (s: string): void {
            if (s != "") {
              setCurrentMember({ ...currentMember, colorStr: s });
            } else {
              const t = { ...currentMember };

              delete t.colorStr;
              setCurrentMember(t);
            }
          }}
        />
      </div>

      <UpdateAndDeleteButtons
        currentItem={currentMember}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}

function UpdateAndDeleteButtons({
  currentItem,
  onUpdate,
  onDelete,
}: {
  currentItem: any;
  onUpdate: (ci: any) => void;
  onDelete: (ci: any) => void;
}) {
  const [confirming, setConfirming] = useState<"UPDATE" | "DELETE" | "NONE">(
    "NONE",
  );

  return confirming == "NONE" ? (
    <div
      className="edit-family-member-button-container"
      style={{ width: "25%" }}
    >
      <div
        className="edit-family-member-button"
        onClick={() => {
          //onUpdate(currentItem);
          setConfirming("UPDATE");
        }}
      >{`Update`}</div>

      <div
        className="edit-family-member-button"
        onClick={() => {
          //onDelete(currentItem);
          setConfirming("DELETE");
        }}
      >{`Delete`}</div>
    </div>
  ) : (
    <div
      className="edit-family-member-button-container"
      style={{ width: "25%" }}
    >
      <div
        className="edit-family-member-button-confirm"
        onClick={() => {
          if (confirming == "UPDATE") {
            onUpdate(currentItem);
          } else {
            onDelete(currentItem);
          }
          setConfirming("NONE");
        }}
      >{`Comfirm ${confirming == "UPDATE" ? "Update" : "Deletion"}`}</div>

      <div
        className="edit-family-member-button"
        onClick={() => {
          //onDelete(currentItem);
          setConfirming("NONE");
        }}
      >{`Cancel`}</div>
    </div>
  );
}

function CreateFamilyMember({
  fm,
  onCreate,
}: {
  fm: FamilyIndividual;
  onCreate: (cm: FamilyIndividual) => void;
}) {
  const [currentMember, setCurrentMember] = useState<FamilyIndividual>(fm);

  return (
    <div className="edit-family-member">
      <div className="edit-family-member-element" style={{ width: "25%" }}>
        <TextForm
          title={"Name"}
          textValue={currentMember.name}
          onSetVal={(s: string) => {
            setCurrentMember({ ...currentMember, name: s });
          }}
        />
      </div>
      <div className="edit-family-member-element" style={{ width: "10%" }}>
        <select
          value={currentMember.role}
          onChange={(e) => {
            setCurrentMember({
              ...currentMember,
              role: e.target.value as FamilyIndividualRoles,
            });
          }}
          style={{ width: "100%" }}
        >
          {["MOM", "DAD", "GRANDPARENT", "CHILD", "OTHER", "PARENT"].map(
            (r) => {
              r;
              return (
                <option key={`cr-${r}`} value={r}>
                  {r}
                </option>
              );
            },
          )}
        </select>
      </div>
      <div className="edit-family-member-element" style={{ width: "10%" }}>
        <BooleanForm
          title={`Can Drive`}
          boolValue={currentMember.canDrive}
          onSetVal={function (b: boolean): void {
            setCurrentMember({ ...currentMember, canDrive: b });
          }}
        />
      </div>
      <div className="edit-family-member-element" style={{ width: "10%" }}>
        <BooleanForm
          title={`Can Edit`}
          boolValue={currentMember.canEditCalendar}
          onSetVal={function (b: boolean): void {
            setCurrentMember({ ...currentMember, canEditCalendar: b });
          }}
        />
      </div>
      <div className="edit-family-member-element" style={{ width: "20%" }}>
        <TextForm
          title={`Color`}
          textValue={currentMember?.colorStr ?? ""}
          onSetVal={function (s: string): void {
            if (s != "") {
              setCurrentMember({ ...currentMember, colorStr: s });
            }
          }}
        />
      </div>

      <div
        className="edit-family-member-button-container"
        style={{ width: "25%" }}
      >
        <div
          className="edit-family-member-button-confirm"
          onClick={() => {
            onCreate(currentMember);
          }}
        >{`Create`}</div>
      </div>
    </div>
  );
}

export function EditFamilyVehiclesUI({
  familyVehicles,
  onUpdate,
  onDelete,
  onCreate,
}: {
  familyVehicles: Vehicle[];
  onUpdate: (cmb: Vehicle) => void;
  onDelete: (fi: Vehicle) => void;
  onCreate: (fi: Vehicle) => void;
}) {
  const [creatingNewVehicle, setCreatingNewVehicle] = useState<boolean>(false);
  return (
    <div className="edit-family-vehicles">
      <div
        className="edit-family-member-button-container"
        style={{ width: "100%", padding: "10px 4px" }}
      >
        <h3>{`Family Vehicles`}</h3>
        {!creatingNewVehicle && (
          <div
            className="edit-family-member-button-container"
            style={{ width: "25%" }}
          >
            <div
              className="edit-family-member-button"
              onClick={() => {
                setCreatingNewVehicle(true);
              }}
            >{`Create`}</div>
          </div>
        )}
        {creatingNewVehicle && (
          <div
            className="edit-family-member-button-container"
            style={{ width: "25%" }}
          >
            <div
              className="edit-family-member-button"
              onClick={() => {
                setCreatingNewVehicle(false);
              }}
            >{`Cancel`}</div>
          </div>
        )}
      </div>

      <div className="edit-family-vehicles-container">
        {familyVehicles.map((fv, i) => {
          return (
            <EditFamilyVehicle
              key={`fv-${fv.id}-${i}`}
              fv={fv}
              onUpdate={function (cm: Vehicle): void {
                //console.log(cm);
                onUpdate(cm);
              }}
              onDelete={function (cm: Vehicle): void {
                //console.log(cm);
                onDelete(cm);
              }}
            />
          );
        })}

        {creatingNewVehicle && (
          <CreateFamilyVehicle
            fv={{
              id: -1,
              name: "",
              numPeopleCanFit: 5,
            }}
            onCreate={function (v: Vehicle): void {
              //console.log(v);
              onCreate(v);
              setCreatingNewVehicle(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditFamilyVehicle({
  fv,
  onUpdate,
  onDelete,
}: {
  fv: Vehicle;
  onUpdate: (cm: Vehicle) => void;
  onDelete: (cm: Vehicle) => void;
}) {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(fv);

  return (
    <div className="edit-family-member">
      <div className="edit-family-member-element" style={{ width: "35%" }}>
        <TextForm
          title={"Car Name"}
          textValue={currentVehicle.name}
          onSetVal={(s: string) => {
            setCurrentVehicle({ ...currentVehicle, name: s });
          }}
        />
      </div>
      <div className="edit-family-member-element" style={{ width: "40%" }}>
        <NumberForm
          title={`Max number of occupants`}
          numberValue={currentVehicle.numPeopleCanFit}
          onSetVal={function (v: number): void {
            setCurrentVehicle({ ...currentVehicle, numPeopleCanFit: v });
          }}
        />
      </div>

      <UpdateAndDeleteButtons
        currentItem={currentVehicle}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}

function CreateFamilyVehicle({
  fv,
  onCreate,
}: {
  fv: Vehicle;
  onCreate: (cv: Vehicle) => void;
}) {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(fv);

  return (
    <div className="edit-family-member">
      <div className="edit-family-member-element" style={{ width: "35%" }}>
        <TextForm
          title={"Car Name"}
          textValue={currentVehicle.name}
          onSetVal={(s: string) => {
            setCurrentVehicle({ ...currentVehicle, name: s });
          }}
        />
      </div>

      <div className="edit-family-member-element" style={{ width: "40%" }}>
        <NumberForm
          title={`Max number of occupants`}
          numberValue={currentVehicle.numPeopleCanFit}
          onSetVal={function (v: number): void {
            setCurrentVehicle({ ...currentVehicle, numPeopleCanFit: v });
          }}
        />
      </div>

      <div
        className="edit-family-member-button-container"
        style={{ width: "25%" }}
      >
        <div
          className="edit-family-member-button"
          onClick={() => {
            onCreate(currentVehicle);
          }}
        >{`Create`}</div>
      </div>
    </div>
  );
}
