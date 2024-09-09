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
    const idToken = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    const storedUsername = localStorage.getItem('username');

    if (idToken && storedUsername) {
      setUsername(storedUsername); 
    }
  }, []);

  const items = [
    { name: "Home", path: "/" },
    { name: "Highlights", path: "/highlights" },
  ];

  if (username) {
    items.push({ name: "Create", path: "/create-one" });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault(); 
    onSearchTerm(searchInput); 
  };

  const handleLogout = () => {
    localStorage.removeItem('id_token');  // Usuwamy id_token
    localStorage.removeItem('user_name'); // Usuwamy user_name 
    setUsername(null); 
    navigate('/'); 
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
          {username && (
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
          )}
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
