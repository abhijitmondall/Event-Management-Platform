import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import PrivateRoutes from "./routes/PrivateRoutes";
import Dashboard from "./pages/Dashboard/Dashboard";
import EventDetails from "./pages/EventDetails/EventDetails";
import Error from "./pages/Error/Error";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route
          path="/createEvent"
          element={
            <PrivateRoutes>
              <CreateEvent />
            </PrivateRoutes>
          }
        />
        <Route
          path="/event/:id"
          element={
            <PrivateRoutes>
              <EventDetails />
            </PrivateRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoutes>
              <Dashboard />
            </PrivateRoutes>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
