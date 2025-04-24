import { Link, NavLink } from "react-router";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DashboardOutlined } from "@mui/icons-material";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import Loader from "./Loader";
import sortSessionsByTime from "../utils/sortSessionsByTime";

const Menu = (props) => {
  const { menuOpen, sessions, loading, error } = props;

  const activeStyles = {
    backgroundColor: "#e6f1f6",
    width: "100%",
    height: "100%",
    borderRadius: ".5rem",
  };
  return (
    <div className="menu" data-menu-open={menuOpen}>
      <div className="search-container">
        <button>
          <SearchOutlinedIcon style={{ color: "#035172" }} />
        </button>
        <input type="text" placeholder="Search" />
      </div>
      <ul className="menu-list">
          <NavLink to="/dashboard"
          style={({ isActive }) => isActive ? activeStyles : null}
          >
        <li>
            <div>
              <DashboardOutlined className="icon" />
              <span>Dashboard</span>
            </div>
        </li>
          </NavLink>
          <NavLink to="/sessions"
          style={({ isActive }) => isActive ? activeStyles : null}
          >
        <li>
            <div>
              <HistoryIcon className="icon" />
              <span>Sessions</span>
            </div>
        </li>
          </NavLink>
          <NavLink to="/notes"
          style={({ isActive }) => isActive ? activeStyles : null}
          >
        <li>
            <div>
              <DescriptionOutlinedIcon className="icon" />
              <span>Notes</span>
            </div>
        </li>
          </NavLink>
          <NavLink to="/quizzes"
          style={({ isActive }) => isActive ? activeStyles : null}
          >
        <li>
            <div>
              <QuizOutlinedIcon className="icon" />
              <span>Quizzes</span>
            </div>
        </li>
          </NavLink>
          <NavLink to="/flashcards"
          style={({ isActive }) => isActive ? activeStyles : null}
          >
        <li>
            <div>
              <StyleOutlinedIcon className="icon" />
              <span>Flashcards</span>
            </div>
        </li>
          </NavLink>
      </ul>
      <ul className="menu-list">
        <h3>Session History</h3>
        {loading && <Loader />}
        {error && <p>{error}</p>}
        {sortSessionsByTime(sessions).map((session) => (
          <li key={session.id}>
            <Link to={`/sessions/${session.id}`}>
            <div>
              <span>{session.metadata.title.length > 40 ? session.metadata.title.slice(0, 40) + "..." : session.metadata.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {/* <ul className="menu-list">
            <h3>This week</h3>
            <li>
              <div>
                <span> Memoization in React</span>
              </div>
            </li>
            <li>
              <div>
                <span>useState hook best practices</span>
              </div>
            </li>
          </ul>
          <ul className="menu-list">
            <h3>Last week</h3>
            <li>
              <div>
                <span> Object destructuring in JavaScript</span>
              </div>
            </li>
            <li>
              <div>
                <span>Empty array truthy or falsy</span>
              </div>
            </li>
            <li>
              <div>
                <span>Save fetch data to local storage</span>
              </div>
            </li>
          </ul>
          <ul className="menu-list">
            <h3>2 weeks ago</h3>
            <li>
              <div>
                <span>Shalow vs deep copy</span>
              </div>
            </li>
            <li>
              <div>
                <span>Searchng algorithm complexity</span>
              </div>
            </li>
          </ul>
          <ul className="menu-list">
            <h3>1 month ago</h3>
            <li>
              <div>
                <span>Select list items in Html</span>
              </div>
            </li>
            <li>
              <div>
                <span>Conditional rendering in React</span>
              </div>
            </li>
          </ul> */}
    </div>
  );
};

export default Menu;
