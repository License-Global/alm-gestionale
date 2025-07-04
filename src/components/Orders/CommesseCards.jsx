import { Grid } from "@mui/system";
import CommessaCard from "../Widgets/components/CommessaCard";
import NoOrders from "./NoOrders";

const CommesseCards = ({ orders, customers }) => {
  if (!orders || orders.length === 0) {
    return <NoOrders />;
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      {orders &&
        orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
            <CommessaCard order={order} customers={customers} />
          </Grid>
        ))}
    </Grid>
  );
};

export default CommesseCards;
