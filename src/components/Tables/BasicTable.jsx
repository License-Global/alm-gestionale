import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Cancel from "@mui/icons-material/Cancel";
import CheckCircle from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function BasicTable({ orders }) {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Ordini</TableCell>
            <TableCell align="center">Responsabile</TableCell>
            <TableCell align="center">Confermato</TableCell>
            <TableCell align="center">Inizio</TableCell>
            <TableCell align="center">Urgenza</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders &&
            orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => navigate(order.id.toString())}
              >
                <TableCell component="th" scope="row">
                  <b>{order.orderName}</b>
                </TableCell>
                <TableCell align="center">{order.orderManager}</TableCell>
                <TableCell align="center">
                  {order.isConfirmed ? (
                    <CheckCircle fontSize="medium" color="success" />
                  ) : (
                    <Cancel fontSize="medium" color="error" />
                  )}
                </TableCell>
                <TableCell align="center">
                  {dayjs(order.startDate).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell align="center">{order.urgency}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
