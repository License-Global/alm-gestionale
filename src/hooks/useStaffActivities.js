import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
export const useStaffActivities = (staffId) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                let { data, error } = await supabase
                    .from('activities')
                    .select('*')
                    .eq('responsible', staffId);
                
                if (error) throw error;
                setActivities(data);
            } catch (err) {
                setError(err);
                console.error('Errore nel recupero delle attività:', err);
            } finally {
                setLoading(false);
            }
        };

        if (staffId) {
            fetchActivities();
        }
    }, [staffId]);

    return { activities, loading, error };
};
