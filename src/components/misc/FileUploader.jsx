import React, { useState } from "react";
import { Box, Button, LinearProgress, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { supabase } from "../../supabase/supabaseClient";

const FileUploader = ({
  bucketName,
  folderPath,
  onUploadSuccess,
  onUploadError,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadStatus(null);
    } else {
      setFile(null);
      setUploadStatus({
        severity: "error",
        message: "Per favore seleziona un file PDF valido.",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    const filePath = `${folderPath}/${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) throw error;

      setUploadStatus({
        severity: "success",
        message: "File caricato con successo!",
      });
      onUploadSuccess && onUploadSuccess(data);
    } catch (error) {
      console.error("Errore durante l'upload:", error);
      setUploadStatus({
        severity: "error",
        message: "Si è verificato un errore durante l'upload.",
      });
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        fullWidth
        sx={{
          height: 56,
          borderRadius: 2,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          },
        }}
      >
        {file ? file.name : "Carica"}
        <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
      </Button>

      {file && !uploading && (
        <Button
          variant="contained"
          onClick={handleUpload}
          fullWidth
          sx={{
            mt: 2,
            height: 56,
            borderRadius: 2,
          }}
          startIcon={<CheckCircleIcon />}
        >
          Carica PDF
        </Button>
      )}

      {uploading && <LinearProgress sx={{ mt: 2, width: "100%" }} />}

      {uploadStatus && (
        <Alert severity={uploadStatus.severity} sx={{ mt: 2 }}>
          {uploadStatus.message}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploader;
