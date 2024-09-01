    import {useState} from "react";
    import Navbar from "../components/Navbar";
    import { Link, useNavigate } from "react-router-dom";  
    import axios from "axios";
    import { IoMail } from "react-icons/io5";  
    import {FaEye, FaEyeSlash } from "react-icons/fa";
    import "./Login.css";
    import { PWD_REGEX, EMAIL_REGEX } from "../components/regular expressions";

    function Login () {
        const [showPassword, setShowPassword] = useState(false);

        const [email, setEmail] = useState("");
        const [password,setPassword] = useState("");

        const [isEmailValid, setIsEmailValid] = useState(false);
        const [isPasswordValid, setIsPasswordValid] = useState(false);

        const [rememberMe, setRememberMe] = useState(false);

        const navigate = useNavigate();

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setEmail(value);
            setIsEmailValid(EMAIL_REGEX.test(value));
        };

        const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setPassword(value);
            setIsPasswordValid(PWD_REGEX.test(value));
        };

        const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setRememberMe(e.target.checked);
        };



        const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            if (!isEmailValid) {
                alert("Invalid email format");
                return;
            }
        
            if (!isPasswordValid) {
                alert("Invalid password format. Password must be 8-24 characters long, include uppercase and lowercase letters, a number, and a special character.");
                return;
            }
            
            const loginData = {
                email: email,
                password: password,
            };

            try {
                const response = await axios.post("http://localhost:5000/api/login", loginData, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.data.success) {
                    alert(response.data.message);

                    const username = response.data.username;
                    localStorage.setItem('username', username);

                    //JWT token
                    // const token = response.data.token;
                    const token = 'fake-jwt-token';

                    if (rememberMe) {
                        localStorage.setItem('token', token);
                    } else {
                        sessionStorage.setItem('token', token);
                    }

                    navigate("/", { state: {username: username } });

                } else {
                    alert(response.data.error);
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("There was an error logging in. Please try again.");
            }
        };

        return (
            <>
                <Navbar onSearchTerm={() => {}}/>
                <div className="container">
                    <div className="lo-header">
                        <div className="text">Sign In</div>
                        <div className="underline"></div>
                    </div>
                    <form onSubmit={handleLogin}>
                    <div className="lo-inputs">
                    <div className="input">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            <IoMail className="icon"/>   
                        </div>
                        <div className="input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            <div onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon"/>}
                            </div>
                        </div>
                    </div>
                    <label className="remember-me">
                        <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />Remember me
                    </label>
                    <button className="lo-submit" type="submit">Login</button>
                    </form>  
                    <div className="login">Don't have an account? <Link to="/sign-up"><span>Register!</span></Link></div>
                </div>
            </>    
        )
    }

    export default Login;