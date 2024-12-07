import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../../supabase/supabaseClient";

const DownloadFile = ({
  bucketName,
  filePath,
  onDownloadSuccess,
  onDownloadError,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    setDownloading(false);

    if (error) {
      console.error("Errore durante il download:", error);
      onDownloadError && onDownloadError(error);
    } else if (data) {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      onDownloadSuccess && onDownloadSuccess(data);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Typography variant="body1">Scarica: {filePath}</Typography>
      <Button
        variant="contained"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? <CircularProgress size={24} /> : "Scarica File"}
      </Button>
    </Box>
  );
};

export default DownloadFile;
