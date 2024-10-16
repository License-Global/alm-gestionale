import AppRouter from "./Navigation/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import Appbar from "./components/Appbar/Appbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/it";
function App() {
  return (
    <>
      <Router>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <Appbar />
          <AppRouter />
        </LocalizationProvider>
      </Router>
    </>
  );
}

export default App;
