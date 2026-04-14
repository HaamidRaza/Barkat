import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { Slide, ToastContainer } from "react-toastify";
import ScrollToTop from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <ScrollToTop />
      <App />
      <ToastContainer
        autoClose={500}
        transition={Slide}
        position="bottom-right"
      />
    </AppContextProvider>
  </BrowserRouter>,
);
