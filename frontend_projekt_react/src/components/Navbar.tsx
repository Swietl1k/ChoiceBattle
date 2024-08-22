import "./Navbar.css";
import logo from "./logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importowanie Link z react-router-dom

interface Props {
  username?: string | null;
}

function Navbar({ username }: Props) {

  // Pozycje menu ustawione bezpośrednio w komponencie Navbar z odpowiednimi ścieżkami
  const items = [
    { name: "Home", path: "/" },
    { name: "Highlights", path: "/highlights" },
    { name: "Create", path: "/create" }
  ];

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary sticky-top"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <img
            src={logo}
            className="d-inline-block align-text-top"
            style={{ height: "80px" }}
            alt="logo"
          />
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {items.map((item) => (
              <li className="nav-item" key={item.name}>
                <Link className="nav-link active" aria-current="page" to={item.path}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <ul className="navbar-nav navbar-right">
            {username ? (
              <>
                <li className="nav-user">
                  <span className="nav-link">Welcome, {username} </span>
                  <FaRegUserCircle className="icon" style={{ color: "yellow", fontSize: "40px" }} />
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sign-up">
                    Sign Out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/sign-up">
                    <i className="bi bi-person"></i> Sign Up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right"></i> Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
