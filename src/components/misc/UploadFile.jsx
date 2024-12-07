import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { supabase } from "../../supabase/supabaseClient";

const FileUploader = ({ bucketName, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Limita il tipo di file (PDF in questo caso)
    if (selectedFile.type !== "application/pdf") {
      setUploadError("Carica solo file PDF.");
      return;
    }

    setUploadError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Carica il file su Supabase
      const filePath = `uploads/${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { contentType: file.type });

      if (error) {
        setUploadError(error.message);
      } else {
        console.log("File caricato con successo:", data.path);
        if (onUploadComplete) onUploadComplete(data.path);
      }
    } catch (error) {
      setUploadError("Si è verificato un errore durante il caricamento.");
    } finally {
      setIsUploading(false);
      setFile(null); // Resetta il file dopo il caricamento
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6">Carica un file PDF</Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        Scegli file
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {file && (
        <Typography variant="body2" color="textSecondary">
          File selezionato: {file.name}
        </Typography>
      )}

      {isUploading ? (
        <CircularProgress />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
        >
          Carica
        </Button>
      )}

      {uploadError && (
        <Typography variant="body2" color="error">
          {uploadError}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploader;
