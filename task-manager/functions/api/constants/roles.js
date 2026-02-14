// This is making an ENUM in javascript.
// Object.freeze makes an object immutable.
export const USER_ROLES = Object.freeze({
    ADMIN: "admin",
    DEVELOPER: "developer",
    CLINICIAN: "clinician",
});

// A helper array to check for user values
export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES));

// Checks if a role is a valid role. 
export function isValidUserRole(value) {
    return USER_ROLE_VALUES.includes(value);
}