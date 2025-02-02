import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";


const useUser = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { userId, loading };
};

export default useUser;
