import type { IState } from "./IState";

export type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_PASS"; payload: string }
  | { type: "SET_LOCATION"; payload: { address: string; pincode: string; lat: number | null; lng: number | null } }
  | { type: "SET_LOCATION_ADDRESS"; payload: string }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_CONFIRM_PASS"; payload: string }
  | { type: "RESET_FORM"; payload: Partial<IState> };
