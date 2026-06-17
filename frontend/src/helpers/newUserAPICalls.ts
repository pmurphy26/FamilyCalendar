import type { Family, FamilyIndividual } from "@shared/types";

/**
 * API call to create a new family
 */
export async function createNewFamilyAPICall(
  authToken: string,
): Promise<Family | null> {
  try {
    const res = await fetch("http://localhost:3001/api/family", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to edit event's driving situation: ${res.status}`,
      );
    }

    const data = await res.json();
    const { family } = data;
    return family;
  } catch (err) {
    console.log("Error creating family");
    return null;
  }
}

/**
 * API call to create a new user for a given family id
 */
export async function createMemberWithFamilyID(
  familyID: number,
  newIndividual: FamilyIndividual,
  authToken: string,
): Promise<FamilyIndividual | null> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/familyIndividual/${familyID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newIndividual),
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to get the days in the period: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    return null;
  }
}

/**
 * API call to create a new user for a given family code
 */
export async function createMemberWithFamilyCode(
  familyCode: string,
  newIndividual: FamilyIndividual,
  authToken: string,
): Promise<FamilyIndividual | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/familyIndividual/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ ...newIndividual, code: familyCode }),
    });

    if (!res.ok) {
      throw new Error(`Failed to get the days in the period: ${res.status}`);
    }

    const data = await res.json();

    return data;
  } catch (err) {
    return null;
  }
}

/**
 * API call to link user with new family individual
 */
export async function linkUserToIndividual(
  userID: number,
  familyIndividualID: number,
  authToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `http://localhost:3001/api/user/family/${userID}/${familyIndividualID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (!res.ok) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("error linking user and individual");
    return false;
  }
}
