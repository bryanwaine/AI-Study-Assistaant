
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoSm from "../LogoSm/LogoSm";
import "./Header.css";

const Header = ({setMenuOpen, setSidebarOpen, photoURL, displayName}) => {
    return (
        <header>
          <nav>
            <div className="nav-left">
              <MenuIcon
                fontSize="large"
                style={{ color: "white" }}
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                }}
              />
            </div>
            <div className="nav-center">
              <LogoSm variant="light" />
            </div>
            <div
              className="nav-right"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <div className="avatar-container">
                {photoURL ? (
                  <img className="avatar" src={photoURL} alt={displayName} />
                ) : (
                  <AccountCircleIcon
                    style={{ color: "white", fontSize: "3rem" }}
                  />
                )}
              </div>
            </div>
          </nav>
        </header>
    );
}

export default Header