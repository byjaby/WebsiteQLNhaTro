import { createContext, useContext } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
const UserContext = createContext();
export function UserProvider({ children }) {
  const { user, loading, error, setUser } = useCurrentUser();
  return (
    <UserContext.Provider value={{ user, loading, error, setUser }}>
      {" "}
      {children}{" "}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
