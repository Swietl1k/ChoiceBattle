import "./Navbar.css";
import logo from "./logo.png";

interface Props {
  items: string[];
}

function Navbar({ items }: Props) {
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
          ></img>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {items.map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link active" aria-current="page" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            ></input>
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          <ul className="navbar-nav navbar-right">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-person"></i> Sign Up
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-box-arrow-in-right"></i> Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
