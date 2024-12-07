import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { addNote } from "../../services/notesServices";
import dayjs from "dayjs";

const Chatbox = ({ authorizedUser, selectedItem, closeModal }) => {
  const [newMessage, setNewMessage] = useState("");
  const endOfMessagesRef = useRef(null);

  const sendMessage = async (
    orderId,
    activityName,
    noteContent,
    sender = authorizedUser
  ) => {
    try {
      await addNote(orderId, activityName, noteContent, sender);
      setNewMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedItem.note]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "400px",
          width: "100%",
          maxWidth: "400px",
          p: 1,
          border: "1px solid #ccc",
          borderRadius: "8px",
          mx: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Area Messaggi */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 1 }}>
          <List dense>
            {selectedItem.note.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  justifyContent:
                    message.sender === authorizedUser
                      ? "flex-end"
                      : "flex-start",
                  display: "flex",
                  flexDirection: "column", // Per mettere la label sopra il messaggio
                  alignItems:
                    message.sender === authorizedUser
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#888",
                    mb: 0.5, // Spazio sotto la label
                  }}
                >
                  {message.sender}{" "}
                  {dayjs(message.created_at).format("DD/MM/YYYY HH:mm")}
                </Typography>

                <Paper
                  sx={{
                    p: 1,
                    maxWidth: "75%",
                    bgcolor:
                      message.sender === authorizedUser ? "#e0f7fa" : "#f1f1f1",
                    borderRadius:
                      message.sender === authorizedUser
                        ? "16px 16px 0 16px"
                        : "16px 16px 16px 0",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                </Paper>
              </ListItem>
            ))}
            <div ref={endOfMessagesRef} />
          </List>
        </Box>

        {/* Input Messaggio */}
        <Box sx={{ display: "flex" }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrivi..."
            variant="outlined"
            size="small"
          />
          <Button
            onClick={() =>
              sendMessage(
                selectedItem.orderId,
                selectedItem.name,
                newMessage,
                authorizedUser
              )
            }
            variant="contained"
            size="small"
            sx={{ ml: 1, mb: 4 }}
          >
            Invia
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Chatbox;
