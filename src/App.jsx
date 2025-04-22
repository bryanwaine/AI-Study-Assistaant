import { BrowserRouter, Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Session from "./pages/Session";
import Sessions from "./pages/Sessions";
import NewSession from "./pages/NewSession";
// import setAppHeight from "./utils/setAppHeight";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route path="/sessions/:sessionId" element={<Session />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
