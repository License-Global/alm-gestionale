import AppRouter from "./Navigation/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
function App() {
  return (
    <>
      <Router>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <DashboardLayout>
            <AppRouter />
          </DashboardLayout>
        </LocalizationProvider>
      </Router>
    </>
  );
}

export default App;
