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
import { Button } from "@mui/material";
import { useDeleteOrder } from "../../hooks/useDeleteOrder";
import NoOrders from "../Orders/NoOrders";

export default function BasicTable({ orders }) {
  const navigate = useNavigate();

  const { deleteOrder, loading, success } = useDeleteOrder();

  const handleDelete = (orderId) => {
    deleteOrder(orderId).then(() => {
      if (loading === false) {
        window.location.reload();
      }
    });
  };
  return (
    <>
      {orders.length === 0 ? (
        <NoOrders />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Ordini</TableCell>
                <TableCell align="center">Responsabile</TableCell>
                <TableCell align="center">Confermato</TableCell>
                <TableCell align="center">Inizio</TableCell>
                <TableCell align="center">Urgenza</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders &&
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      component="th"
                      scope="row"
                    >
                      <b>{order.orderName}</b>
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {order.orderManager}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {order.isConfirmed ? (
                        <CheckCircle fontSize="medium" color="success" />
                      ) : (
                        <Cancel fontSize="medium" color="error" />
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {dayjs(order.startDate).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell
                      onClick={() => navigate(order.id.toString())}
                      align="center"
                    >
                      {order.urgency}
                    </TableCell>
                    <TableCell align="center">
                      {" "}
                      <Button
                        variant="contained"
                        onClick={() => handleDelete(order.id)}
                        color="error"
                      >
                        Elimina
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
