import { NavLink } from "react-router";
import { DashboardOutlined } from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";

import Loader from "../Loader/Loader";

import sortSessionsByTime from "../../utils/sortSessionsByTime";

import "./Menu.css";

const Menu = (props) => {
  const { menuOpen, setMenuOpen, sessions, loading, error } = props;

  const activeStyles = {
    backgroundColor: "#e6f1f6 ",
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
        <button className="search__button" id="search__button" aria-label="search button" aria-labelledby="search button">
          <SearchOutlinedIcon fontSize="small" style={{ color: "#035172" }} />
        </button>
        <input type="text" placeholder="Search" className="search__input" />
      </div>
      <ul className="menu__list">
        <li className="menu__item">
          <NavLink
            className="menu__navlink"
            to="/dashboard"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={onClick}
          >
            <div className="menu__list-item">
              <DashboardOutlined fontSize="small" className="icon" />
              <span className="menu__list-name">Dashboard</span>
            </div>
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__navlink"
            to="/sessions"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={onClick}
          >
            <div className="menu__list-item">
              <HistoryIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Sessions</span>
            </div>
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__navlink"
            to="/notes"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={onClick}
          >
            <div className="menu__list-item">
              <DescriptionOutlinedIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Notes</span>
            </div>
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__navlink"
            to="/quizzes"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={onClick}
          >
            <div className="menu__list-item">
              <QuizOutlinedIcon fontSize="small" className="icon" />
              <span className="menu__list-name">Quizzes</span>
            </div>
          </NavLink>
        </li>
        <li className="menu__item">
          <NavLink
            className="menu__navlink"
            to="/decks"
            style={({ isActive }) => (isActive ? activeStyles : null)}
            onClick={onClick}
          >
            <div className="menu__list-item">
              <StyleOutlinedIcon className="icon" />
              <span className="menu__list-name">Flashcards</span>
            </div>
          </NavLink>
        </li>
      </ul>
      {sessions.length > 0 && (
        <>
          <h3 className="menu__list-title">Session History</h3>
          <ul className="menu__list">
            {loading && <Loader />}
            {error && <p>{error}</p>}
            {sortSessionsByTime(sessions).map((session) => (
              <li className="menu__item"  key={session.id}>
                <NavLink
                  className="menu__navlink"
                  to={`/sessions/${session.id}`}
                  style={({ isActive }) => (isActive ? activeStyles : null)}
                  onClick={onClick}
                >
                  <div className="menu__list-item">
                    <span className="menu__list-name">
                      {session.metadata.title}
                    </span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Menu;
