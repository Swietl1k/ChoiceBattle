import {useState} from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";    
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

function Login () {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Navbar items={["Home", "Highlights", "Create"]} />
            <div className="container">
                <div className="lo-header">
                    <div className="text">Sign In</div>
                    <div className="underline"></div>
                </div>  
                <div className="lo-inputs">
                    <div className="input">
                        <input type="text" placeholder="Email" required/>
                        <FaUser className="icon"/>   
                    </div>
                    <div className="input">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" required/>
                        <div onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon"/>}
                        </div>
                    </div>
                </div>
                <label className="remember-me"><input type="checkbox" />Remember me</label>
                <button className="lo-submit" type="submit">Login</button>
                <div className="login">Don't have an account? <Link to="/sign-up"><span>Register!</span></Link></div>
            </div>
        </>    
    )
}

export default Login;