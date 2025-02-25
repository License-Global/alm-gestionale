import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import SearchIcon from "@mui/icons-material/Search";
import { fetchCustomers } from "../../../services/customerService";
import { useNavigate } from "react-router-dom";
import { usePersonale } from "../../../hooks/usePersonale";

const OperatorsTable = () => {
  const navigate = useNavigate();
  const personale = usePersonale();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      personale.personale.map((operatore) => ({
        name: operatore.workerName,
        id: operatore.id,
      }))
    );
  }, [personale.personale]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Operatore</TableCell>
            <TableCell align="right">Dettaglio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <span onClick={() => navigate(`/operatore/${row.id}`)}>
                  <SearchIcon sx={{ cursor: "pointer" }} color="primary" />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OperatorsTable;
