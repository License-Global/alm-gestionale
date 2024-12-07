import { supabase } from "../supabase/supabaseClient";
/**
 * Ottiene l'URL pubblico di un file nel bucket Supabase.
 * @param {string} bucketName - Il nome del bucket.
 * @param {string} filePath - Il percorso del file nel bucket.
 * @returns {Promise<{ success: boolean, data?: string, error?: any }>}
 */
export const getPublicPdfUrl = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (error) {
    console.error("Errore nell'ottenere l'URL pubblico:", error);
    return { success: false, error };
  } else {
    return { success: true, data: data.publicUrl };
  }
};

/**
 * Ottiene un URL firmato per accedere al file PDF.
 * @param {string} bucketName - Il nome del bucket.
 * @param {string} filePath - Il percorso del file nel bucket.
 * @param {number} expiresIn - Tempo di validità dell'URL in secondi.
 * @returns {Promise<{ success: boolean, data?: string, error?: any }>}
 */
export const getSignedPdfUrl = async (bucketName, filePath, expiresIn = 60) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error("Errore nella creazione dell'URL firmato:", error);
    return { success: false, error };
  } else {
    return { success: true, data: data.signedUrl };
  }
};

/**
 * Elimina un file da una cartella nel bucket Supabase.
 * @param {string} bucketName - Il nome del bucket.
 * @param {string} filePath - Il percorso del file nel bucket.
 * @returns {Promise<{ success: boolean, error?: any }>}}
 */
export const deleteFileFromBucket = async (bucketName, filePath) => {
  const { error } = await supabase.storage.from(bucketName).remove([filePath]);

  if (error) {
    console.error("Errore nell'eliminazione del file:", error);
    return { success: false, error };
  } else {
    return { success: true };
  }
};
