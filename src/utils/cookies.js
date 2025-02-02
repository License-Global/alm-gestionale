import Cookies from "js-cookie";

// Imposta il ruolo nel cookie (valido per 1 giorno, con SameSite configurato)
export const setRole = (role) => {
  Cookies.set("user_role", role, { expires: 1, sameSite: "Lax" });
};

// Recupera il ruolo dai cookie
export const getRole = () => {
  return Cookies.get("user_role") || null;
};

// Rimuove il ruolo dai cookie
export const removeRole = () => {
  Cookies.remove("user_role");
};
