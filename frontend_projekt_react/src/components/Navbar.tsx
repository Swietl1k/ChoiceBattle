import "./Navbar.css";
import logo from "./logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  onSearchTerm: (item: string) => void;
}

function Navbar({onSearchTerm }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState<string | null>(null);


  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const idToken = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
    const storedUsername = localStorage.getItem('user_name');

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

  const handleLogout = async () => {
    const idToken = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');

    if (idToken) {
      try {
        await axios.post('https://127.0.0.1:8000/strona/logout/', {}, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        });
    
        localStorage.removeItem('id_token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('expires_in');
        setUsername(null);
    
        navigate('/');
      } catch (error) {
        console.error("Logout error:", error);
        alert("Error logging out. Please try again.");
      }
    } else {
      alert("No token found.");
    }
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
            {location.pathname === "/" && (
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
