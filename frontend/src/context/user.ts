import { createContext, useContext } from "react";

export const USER_OPTIONS = ["Marcin", "Emilia", "Ala", "Artur"] as const;

export type UserName = (typeof USER_OPTIONS)[number];

export type UserContextValue = UserName | null;

export const UserContext = createContext<UserContextValue>(null);

export function useUser(): UserContextValue {
  return useContext(UserContext);
}
