import AppRouter from "./Navigation/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import Appbar from "./components/Appbar/Appbar";

function App() {
  return (
    <>
      <Router>
        <Appbar />
        <AppRouter />
      </Router>
    </>
  );
}

export default App;
