import HistoryIcon from "@mui/icons-material/History";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { DashboardOutlined } from "@mui/icons-material";
import { Link } from "react-router";

const Menu = ({ menuOpen }) => {
    return (
        <div className="menu" data-menu-open={menuOpen}>
        <div className="search-container">
            <button>
              <SearchOutlinedIcon  style={{ color: "#035172" }}/>
            </button>
            <input type="text" placeholder="Search" />
          </div>
          <ul className="menu-list">
            <li>
              <Link to="/dashboard">
                <div>
                  <DashboardOutlined className="icon" />
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/sessions">
                <div>
                  <HistoryIcon className="icon" />
                  <span>Sessions</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="#notes">
                <div>
                  <DescriptionOutlinedIcon className="icon" />
                  <span>Notes</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="#quizzes">
                <div>
                  <QuizOutlinedIcon className="icon" />
                  <span>Quizzes</span>
                </div>
              </Link>
            </li>
          </ul>
          <ul className="menu-list">
            <h3>Today</h3>
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
          </ul>
        </div>
    )   
}

export default Menu