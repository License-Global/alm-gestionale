import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useAllOrders } from "../../hooks/useOrders";
import { useCustomers } from "../../hooks/useCustomeres";
import { useNavigate } from "react-router-dom";
import { usePersonale } from "../../hooks/usePersonale";

const Searchbar = ({ minisearch, type }) => {
  const { orders } = useAllOrders();
  const { customers } = useCustomers();
  const personale = usePersonale();

  const navigate = useNavigate();

  const [ordersList, setOrdersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [operatorsList, setOperatorsList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Stato per il testo nell'input
  const [value, setValue] = useState(null); // Stato per l'opzione selezionata

  useEffect(() => {
    orders && setOrdersList(orders);
    customers && setCustomersList(customers);
    personale && setOperatorsList(personale.personale);
  }, [orders, customers, personale]);

  useEffect(() => {
    if (minisearch) {
      if (type === "orders") {
        const suggestions = ordersList.map((order, index) => ({
          key: index + "order",
          id: order.id,
          isArchived: order.isArchived,
          label: order.orderName,
          isOrder: true,
          icon: order.isArchived ? (
            <Inventory2Icon color="primary" />
          ) : (
            <AssignmentIcon color="secondary" />
          ),
        }));
        setSuggestions(suggestions);
      } else if (type === "customers") {
        const customersSuggestions = customersList.map((customer, index) => ({
          key: index + "customer",
          id: customer.id,
          label: customer.customer_name,
          icon: <PersonRoundedIcon color="warning" />,
          isCustomer: true,
        }));
        setSuggestions(customersSuggestions);
      } else if (type === "operators") {
        const operatorsSuggestions = operatorsList.map((operator, index) => ({
          key: index + "operator",
          id: operator.id,
          label: operator.workerName,
          icon: <PersonRoundedIcon color="info" />,
          isOperator: true,
        }));
        setSuggestions(operatorsSuggestions);
      }
    } else {
      const suggestions = ordersList.map((order, index) => ({
        key: index + "order",
        id: order.id,
        isArchived: order.isArchived,
        label: order.orderName,
        icon: order.isArchived ? (
          <Inventory2Icon color="primary" />
        ) : (
          <AssignmentIcon color="secondary" />
        ),
      }));
      setSuggestions(suggestions);
      const customersSuggestions = customersList.map((customer, index) => ({
        key: index + "customer",
        id: customer.id,
        label: customer.customer_name,
        icon: <PersonRoundedIcon color="warning" />,
        isCustomer: true,
      }));
      setSuggestions((prev) => [...prev, ...customersSuggestions]);
    }
  }, [ordersList, customersList, operatorsList, type, minisearch]);

  return (
    <Autocomplete
      value={value} // Controlla il valore selezionato
      onChange={(event, newValue) => {
        if (newValue) {
          if (newValue.isArchived) {
            navigate(`/archivio/${newValue.id}`);
          } else if (newValue.isOrder && !newValue.isArchived) {
            navigate(`/order/${newValue.id}`);
          } else if (newValue.isCustomer) {
            navigate(`/cliente/${newValue.id}`);
          } else if (newValue.isOperator) {
            navigate(`/operatore/${newValue.id}`);
          }
          setValue(null); // Ripristina il valore selezionato a null
          setInputValue(""); // Svuota anche il campo di testo
        }
      }}
      inputValue={inputValue} // Colleghiamo lo stato all'input
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      disableClearable
      includeInputInList
      renderOption={(props, option) => (
        <ListItem {...props} key={option.key}>
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.label} />
        </ListItem>
      )}
      noOptionsText={"Nessuna corrispondenza..."}
      forcePopupIcon={false}
      options={suggestions}
      sx={{
        width: "25%",
        mr: 8,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          placeholder="Cerca..."
          fullWidth
          sx={{
            "& .MuiInput-underline:before": {
              borderBottomColor: "black",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "black",
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default Searchbar;
