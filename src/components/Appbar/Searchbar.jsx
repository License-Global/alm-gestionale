import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";
import SearchDataLoader from "./SearchDataLoader"; // importa il componente loader

const Searchbar = ({ minisearch, type }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);

  // Quando il loader passa i dati, li salvo nello stato locale
  const handleDataLoaded = (data) => {
    setDataLoaded(data);
  };

  // Genera le suggestions in base al tipo e alla modalità
  useEffect(() => {
    if (!dataLoaded) return;

    const { orders, customers, personale } = dataLoaded;
    if (minisearch) {
      if (type === "orders") {
        const suggestions = orders.map((order, index) => ({
          key: index + "order",
          id: order.id,
          isArchived: order.isArchived,
          label:
            order.orderName +
            " - " +
            customers.find((c) => c.id === order.clientId).customer_name,
          isOrder: true,
          icon: order.isArchived ? (
            <Inventory2Icon color="primary" />
          ) : (
            <AssignmentIcon color="secondary" />
          ),
        }));
        setSuggestions(suggestions);
      } else if (type === "operator-orders") {
        const filteredOrders = orders.filter((order) => !order.isArchived);
        const suggestions = filteredOrders.map((order, index) => ({
          key: index + "order",
          id: order.id,
          isArchived: order.isArchived,
          label:
            order.orderName +
            " - " +
            customers.find((c) => c.id === order.clientId).customer_name,
          isOrder: true,
          icon: <AssignmentIcon color="secondary" />,
        }));
        setSuggestions(suggestions);
      } else if (type === "customers") {
        const customersSuggestions = customers.map((customer, index) => ({
          key: index + "customer",
          id: customer.id,
          label: customer.customer_name,
          icon: <PersonRoundedIcon color="warning" />,
          isCustomer: true,
        }));
        setSuggestions(customersSuggestions);
      } else if (type === "operators") {
        const operatorsSuggestions = personale.map((operator, index) => ({
          key: index + "operator",
          id: operator.id,
          label: operator.workerName,
          icon: <PersonRoundedIcon color="info" />,
          isOperator: true,
        }));
        setSuggestions(operatorsSuggestions);
      }
    } else {
      // In modalità non minisearch combiniamo ordini e clienti
      const orderSuggestions = orders.map((order, index) => ({
        key: index + "order",
        id: order.id,
        isArchived: order.isArchived,
        label:
          order.orderName +
          " - " +
          customers.find((c) => c.id === order.clientId).customer_name,
        icon: order.isArchived ? (
          <Inventory2Icon color="primary" />
        ) : (
          <AssignmentIcon color="secondary" />
        ),
      }));
      const customersSuggestions = customers.map((customer, index) => ({
        key: index + "customer",
        id: customer.id,
        label: customer.customer_name,
        icon: <PersonRoundedIcon color="warning" />,
        isCustomer: true,
      }));
      setSuggestions([...orderSuggestions, ...customersSuggestions]);
    }
  }, [dataLoaded, type, minisearch]);

  // Calcola il loading in base al fatto che i dati siano stati caricati o no
  const loading = open && !dataLoaded;

  return (
    <>
      {open && !dataLoaded && (
        <SearchDataLoader onDataLoaded={handleDataLoaded} />
      )}
      <Autocomplete
        open={open}
        onOpen={() => {
          setOpen(true);
          setDataLoaded(null); // Reset per forzare il reload dei dati se necessario
        }}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(event, newValue) => {
          if (newValue) {
            if (newValue.isArchived) {
              navigate(`/archivio/${newValue.id}`);
            } else if (newValue.key.includes("order") && !newValue.isArchived) {
              navigate(`/${newValue.id}`);
            } else if (newValue.isCustomer) {
              navigate(`/clienti/${newValue.id}`);
            } else if (newValue.isOperator) {
              navigate(`/operatore/${newValue.id}`);
            }
            setValue(null);
            setInputValue("");
          }
        }}
        inputValue={inputValue}
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
        loading={loading}
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
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default Searchbar;
