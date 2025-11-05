export const findPasswordFields = ['email', 'email_validation', 'newPassword', 'form'];
export type FindPasswordField = (typeof findPasswordFields)[number];
export const findIdFields = ['nickName', 'runningType', 'emailResult', 'form'];
export type FindIdField = (typeof findIdFields)[number];
export const loginFields = ['email', 'password', 'form'];
export type LoginField = (typeof loginFields)[number];

export const RUNNING_TYPES = ['JOGGING', 'HALF_MARATHON', 'RUNNING', 'TRAIL_RUNNING', 'INTERVAL_TRAINING'];

export const userDataFields = ['name', 'nickName', 'email', 'weight', 'height', 'weight', 'runningType', 'form'];
export type UserDataField = (typeof userDataFields)[number];

export const signUpFields = ['email', 'email_validation', 'password', ...userDataFields];
export type SignUpField = (typeof signUpFields)[number];

export const routineFields = ['type', 'place', 'destination', 'day', 'time', 'form'];
export type RoutineField = (typeof routineFields)[number];
