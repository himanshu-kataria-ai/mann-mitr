import { BrowserRouter } from "react-router";
import AppRouter from "./router/index.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
