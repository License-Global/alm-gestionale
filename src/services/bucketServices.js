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

export async function getFileCount(bucketName, folderPath) {
  try {
    // Ottieni la lista dei file nella cartella specificata
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100, // Limite massimo di file da ottenere
        offset: 0, // Offset per la paginazione
      });

    if (error) {
      throw error;
    }

    // Restituisci il numero di file
    return data.length;
  } catch (error) {
    console.error("Errore nel prelevare i file:", error.message);
    return 0;
  }
}
