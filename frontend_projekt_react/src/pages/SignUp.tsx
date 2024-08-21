import {useState} from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";    
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import "./SignUp.css";


function SignUp () {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Navbar items={["Home", "Highlights", "Create"]} />
            <div className="container">
                <div className="su-header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>  
                <div className="su-inputs">
                    <div className="input">
                        <input type="text" placeholder="Username" required/>
                        <FaUser className="icon"/>   
                    </div>
                    <div className="input">
                        <input type="email" placeholder="Email" required/>
                        <IoMail className="icon"/>
                    </div>
                    <div className="input">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" required/>
                        <div onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon"/>}
                        </div>
                    </div>
                </div>
                <button className="su-submit" type="submit">Create account</button>
                <div className="login">Already have an account? <Link to="/login"><span>Click here!</span></Link></div>
            </div>
        </>    
    )
}

export default SignUp;