import { createContext, useContext, useState } from "react";
import { setRole, getRole, removeRole } from "../utils/cookies";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRoleState] = useState(getRole()); // Inizializza con il valore del cookie

  // Imposta il ruolo sia nello stato che nei cookie
  const handleSetRole = (newRole) => {
    setRoleState(btoa(newRole));
    setRole(btoa(newRole)); // Salva il ruolo nel cookie
  };

  // Rimuove il ruolo (per il logout)
  const handleRemoveRole = () => {
    setRoleState(null);
    removeRole();
  };

  return (
    <RoleContext.Provider
      value={{ role, setRole: handleSetRole, removeRole: handleRemoveRole }}
    >
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook per usare il ruolo
export const useRole = () => useContext(RoleContext);
