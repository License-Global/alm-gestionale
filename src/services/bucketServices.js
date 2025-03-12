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

export const createFolder = async (bucketName, folderPath) => {
  try {
    // Supabase non permette di creare cartelle vuote, quindi dobbiamo creare un file segnaposto
    const placeholderFilePath = `${folderPath}/.keep`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(placeholderFilePath, new Blob(["placeholder"], { type: "text/plain" }));

    if (error) {
      throw error;
    }

    console.log("Cartella creata con successo:", folderPath);
    return { success: true, data };
  } catch (error) {
    console.error("Errore nella creazione della cartella:", error.message);
    return { success: false, error };
  }
};

  export const deleteFolder = async (bucketName, folderPath) => {
    try {
      // Recupera lista completa (file e cartelle)
      const { data: items, error: listError } = await supabase
        .storage
        .from(bucketName)
        .list(folderPath, { limit: 1000 }); // aumenta se hai molte risorse
  
      if (listError) throw listError;
  
      if (!items.length) {
        return { message: 'La cartella è vuota o inesistente.' };
      }
  
      const filesToDelete = items
        .filter(item => item.metadata) // metadata esiste solo per i file
        .map(file => `${folderPath}/${file.name}`);
  
      // Se ci sono sottocartelle, eliminale ricorsivamente
      const subfolders = items.filter(item => !item.metadata);
      for (const subfolder of subfolders) {
        await deleteFolder(bucketName, `${folderPath}/${subfolder.name}`);
      }
  
      // Elimina i file nella cartella corrente
      if (filesToDelete.length > 0) {
        const { error: removeError } = await supabase
          .storage
          .from(bucketName)
          .remove(filesToDelete);
  
        if (removeError) throw removeError;
      }
  
      return { message: 'Cartella e contenuti eliminati correttamente.' };
  
    } catch (error) {
      console.error('Errore durante eliminazione ricorsiva:', error);
      return { error };
    }
  };