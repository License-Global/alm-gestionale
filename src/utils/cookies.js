import Cookies from "js-cookie";

// Imposta il ruolo nel cookie (valido per 1 giorno, con SameSite configurato)
export const setRole = (role) => {
  Cookies.set(btoa("user_role"), role, { expires: 365, sameSite: "Lax" });
};

// Recupera il ruolo dai cookie
export const getRole = () => {
  return Cookies.get(btoa("user_role")) || null;
};

// Rimuove il ruolo dai cookie
export const removeRole = () => {
  Cookies.remove(btoa("user_role"));
};

// Utility semplici per cookie stringa (non sicure per dati sensibili)
export function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

export function getCookie(name) {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}
