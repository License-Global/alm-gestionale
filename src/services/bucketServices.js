import { supabase } from "../supabase/supabaseClient";

export const createBucket = async (bucketName) => {
  const { data, error } = await supabase.storage.createBucket(bucketName, {
    public: true, // false significa che il bucket non è pubblico.
  });

  if (error) {
    console.error("Errore nella creazione del bucket:", error);
    return { success: false, error };
  } else {
    console.log("Bucket creato:", data);
    return { success: true, data };
  }
};

export const deleteBucket = async (bucketName) => {
  const { data, error } = await supabase.storage.deleteBucket(bucketName);

  if (error) {
    console.error("Errore nell'eliminazione del bucket:", error);
    return { success: false, error };
  } else {
    console.log("Bucket eliminato:", data);
    return { success: true, data };
  }
};
