import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  CircularProgress,
  Modal,
  IconButton,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import FileList from "./FileList";
import FileUploader from "./FileUploader";
import { supabase } from "../../supabase/supabaseClient";
import useActiveUser from "../../hooks/useActiveUser";
import theme from "../../theme";

const AdminDocsModal = ({ bucketName, folderName }) => {
  const user = useActiveUser();
  const [currentPDF, setCurrentPDF] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(folderName);

      if (error) {
        throw error;
      }

      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (data) => {
    setCurrentPDF(data.path);
    fetchFiles(); // Refresh the file list after successful upload
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    // You might want to show an error message to the user here
  };

  const handleDownload = (fileUrl) => {
    setPdfUrl(fileUrl);
    setPdfModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setPdfModalOpen(false);
    setPdfUrl("");
  };

  const handleDeleteFile = (fileUrl) => {
    fetchFiles();
  };

  return (
    <div>
      {user === btoa("admin") && <Divider sx={{ mb: 4 }} />}
      <Stack spacing={4}>
        {user === btoa("admin") && (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PictureAsPdfIcon color="primary" />
              Nuovo documento
            </Typography>
            <FileUploader
              bucketName={bucketName}
              folderPath={folderName}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </Box>
        )}
        <Divider
          sx={{
            "&::before, &::after": {
              borderColor: theme.palette.primary.light,
            },
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Documenti
          </Typography>
        </Divider>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <FileList
            files={files}
            onDownload={handleDownload}
            onDelete={handleDeleteFile}
            bucketName={bucketName}
            folderName={folderName}
          />
        )}
      </Stack>

      {/* PDF Viewer Modal */}
      <Modal
        open={pdfModalOpen}
        onClose={handleClosePdfModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90vw",
            height: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">Visualizza PDF</Typography>
            <IconButton onClick={handleClosePdfModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="PDF Viewer"
              />
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminDocsModal;
