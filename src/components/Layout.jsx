import { Outlet } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import LogoSm from "./LogoSm";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  const { user } = useAuth();
  const { photoURL, displayName } = user;
 
  return (
    <>
      <header>
        <nav>
          <div className="nav-left">
            <MenuIcon fontSize="large" style={{ color: "white" }}/>
          </div>
          <div className="nav-center">
            <LogoSm variant="light"/>
          </div>
          <div className="nav-right">
            <img className="avatar" src={photoURL} alt={displayName} />
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
