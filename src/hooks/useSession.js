import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

const useSession = () => {
  const [session, setSession] = useState(null); // Sessione utente
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    const getSession = async () => {
      setLoading(true); // Imposta lo stato di caricamento all'inizio
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Errore nel recupero della sessione:", error);
      } else {
        setSession(session); // Imposta la sessione recuperata
      }
      setLoading(false); // Fine del caricamento
    };

    // Ottieni la sessione corrente al montaggio del componente
    getSession();

    // Listener per monitorare cambiamenti nello stato di autenticazione
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session); // Aggiorna la sessione ogni volta che cambia
      }
    );

    // Cleanup del listener quando il componente viene smontato
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading }; // Restituisci la sessione e lo stato di caricamento
};

export default useSession;
