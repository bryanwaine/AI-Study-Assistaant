import { NavLink } from "react-router";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DashboardOutlined } from "@mui/icons-material";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import Loader from "../Loader/Loader";
import sortSessionsByTime from "../../utils/sortSessionsByTime";
import './Menu.css';

const Menu = (props) => {
  const { menuOpen, setMenuOpen, sessions, loading, error } = props;

  const activeStyles = {
    backgroundColor: "#e6f1f6",
    width: "100%",
    height: "100%",
    borderRadius: ".5rem",
  };

  const onClick = () => {
    setMenuOpen(false);
  };
  return (
    <div className="menu" data-menu-open={menuOpen}>
      <div className="search__container">
        <button>
          <SearchOutlinedIcon fontSize="small" style={{ color: "#035172" }} />
        </button>
        <input type="text" placeholder="Search" className="search__input"/>
      </div>
      <ul className="menu__list">
        <NavLink
          to="/dashboard"
          style={({ isActive }) => (isActive ? activeStyles : null)}
          onClick={onClick}
        >
          <li>
            <div className="menu__list-item">
              <DashboardOutlined fontSize="small" className="icon" />
              <span className="menu__list-name">Dashboard</span>
            </div>
          </li>
        </NavLink>
        <NavLink
          to="/sessions"
          style={({ isActive }) => (isActive ? activeStyles : null)}
          onClick={onClick}
        >
          <li>
            <div className="menu__list-item">
              <HistoryIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Sessions</span>
            </div>
          </li>
        </NavLink>
        <NavLink
          to="/notes"
          style={({ isActive }) => (isActive ? activeStyles : null)}
          onClick={onClick}
        >
          <li>
            <div className="menu__list-item">
              <DescriptionOutlinedIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Notes</span>
            </div>
          </li>
        </NavLink>
        <NavLink
          to="/quizzes"
          style={({ isActive }) => (isActive ? activeStyles : null)}
          onClick={onClick}
        >
          <li>
            <div className="menu__list-item">
              <QuizOutlinedIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Quizzes</span>
            </div>
          </li>
        </NavLink>
        <NavLink
          to="/decks"
          style={({ isActive }) => (isActive ? activeStyles : null)}
          onClick={onClick}
        >
          <li>
            <div className="menu__list-item">
              <StyleOutlinedIcon className="icon" />
              <span className="menu__list-name">Flashcards</span>
            </div>
          </li>
        </NavLink>
      </ul>
      {sessions.length > 0 && (
        <ul className="menu__list">
          <h3>Session History</h3>
          {loading && <Loader />}
          {error && <p>{error}</p>}
          {sortSessionsByTime(sessions).map((session) => (
            <NavLink
              to={`/sessions/${session.id}`}
              key={session.id}
              style={({ isActive }) => (isActive ? activeStyles : null)}
              onClick={onClick}
            >
              <li>
                <div className="menu__list-item">
                  <span className="menu__list-name">
                    { session.metadata.title}
                  </span>
                </div>
              </li>
            </NavLink>
          ))}
        </ul>
      )}
      
    </div>
  );
};

export default Menu;
