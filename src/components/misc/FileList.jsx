import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getPublicPdfUrl,
  deleteFileFromBucket,
} from "../../services/pdfServices";
import theme from "../../theme";
import NoFiles from "./NoFiles";

const FileList = ({ files, onDownload, onDelete, bucketName, folderName }) => {
  if (files.length === 0) {
    return <NoFiles />;
  } else
    return (
      <List>
        {files.map((file, index) => (
          <ListItem
            key={index}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              cursor: "pointer",
            }}
            onClick={async () => {
              const url = await getPublicPdfUrl(
                bucketName,
                folderName + "/" + file.name
              );
              onDownload(url.data);
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={file.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="deleteFile"
                onClick={() => {
                  deleteFileFromBucket(
                    bucketName,
                    folderName + "/" + file.name
                  ).then((res) => {
                    if (res.success) {
                      onDelete();
                    }
                  });
                }}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
};

export default FileList;
