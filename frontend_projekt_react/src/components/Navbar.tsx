import "./Navbar.css";
import logo from "./logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Props {
  onSearchTerm: (item: string) => void;
}

function Navbar({onSearchTerm }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);


  const navigate = useNavigate();


  useEffect(() => {
    // Sprawdź, czy token JWT jest w localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      setUsername(storedUsername); // Ustaw nazwę użytkownika, jeśli token istnieje
    }
  }, []);

  const items = [
    { name: "Home", path: "/" },
    { name: "Highlights", path: "/highlights" },
  ];

  if (username) {
    items.push({ name: "Create", path: "/create" });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault(); // Zablokowanie domyślnego zachowania formularza
    onSearchTerm(searchInput); // Przekazanie wartości inputa do Home.tsx
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Usuń token JWT
    localStorage.removeItem('username'); // Usuń nazwę użytkownika
    setUsername(null); // Zresetuj stan użytkownika
    navigate('/'); // Przekieruj na stronę główną
  };

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
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to={item.path}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <form className="d-flex" role="search" onSubmit={handleSearchClick}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchInput}
              onChange={handleSearchChange}
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
                  <FaRegUserCircle
                    className="icon"
                    style={{ color: "yellow", fontSize: "40px" }}
                  />
                </li>
                <li className="nav-item">
                <span className="nav-link" onClick={handleLogout} style={{ cursor: "pointer" }}>
                    Sign Out
                  </span>
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
