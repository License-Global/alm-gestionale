import MainCalendar from "../components/Calendar/FullCalendar/MainCalendar";
import useRealtimeOrderWithActivities from "../hooks/useRealTime";

const Calendario = () => {
  const orders = useRealtimeOrderWithActivities("orders", "activities");
  return <MainCalendar orders={orders} />;
};

export default Calendario;
