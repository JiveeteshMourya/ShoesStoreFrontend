import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { setupInterceptors } from "./api/axiosInstance.js";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";

setupInterceptors(store);

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </Provider>
  </ErrorBoundary>
);
