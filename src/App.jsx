import { BrowserRouter, Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Session from "./pages/Session";
// import setAppHeight from "./utils/setAppHeight";

function App() {
  // window.addEventListener("resize", setAppHeight);
  // window.addEventListener("load", setAppHeight);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-session" element={<Session />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
