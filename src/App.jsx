import { BrowserRouter, Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
