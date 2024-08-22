import {useState} from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";    
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import "./SignUp.css";
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../components/regular expressions";

function SignUp () {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isUsernameValid, setIsUsernameValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Walidacja danych formularza
        if (!USER_REGEX.test(username)) {
            alert("Invalid username format. Username must be 4-24 characters long, start with a letter, and can contain letters, numbers, underscores, or hyphens.");
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            alert("Invalid email format");
            return;
        }
        if (!PWD_REGEX.test(password)) {
            alert("Invalid password format. Password must be 8-24 characters long, include uppercase and lowercase letters, a number, and a special character.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        
    
        // Przygotowanie danych do wysłania
        const userData = {
            email: email,
            password: password,
            user_name: username
        };
    
        // Wysyłanie danych do backendu
        try {
            const response = await axios.post("http://localhost:5000/api/sign-up", userData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
    
            if (response.data.success) {
                alert(response.data.message);

                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setIsUsernameValid(false);
                setIsEmailValid(false);
                setIsPasswordValid(false);
                setIsConfirmPasswordValid(false);

                navigate("/login");

            } else {
                alert(response.data.error);
            }
    
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error creating your account. Please try again.");
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        setIsUsernameValid(USER_REGEX.test(value));
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
        if (confirmPassword !== "") {
            setIsConfirmPasswordValid(value === confirmPassword);
        }
    };
    
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        const isValidPassword = value !== "" && password !== "" && value === password;
        const isValidRegex = PWD_REGEX.test(password);
        const isValid = isValidPassword && isValidRegex;
        setIsConfirmPasswordValid(isValid);
        console.log("Confirm Password valid:", isValid);
    };

    const getInputClass = (isValid: boolean) => {
        return isValid ? "input valid" : "input invalid";
    };


    return (
        <>
            <Navbar />
            <div className="container">
                <div className="su-header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit}>  
                <div className="su-inputs">
                <div className={getInputClass(isUsernameValid)}>
                        <input type="text" 
                        placeholder="Username" 
                        required
                        value={username}
                        onChange={handleUsernameChange}
                        />
                        <FaUser className="icon"/>   
                    </div>
                    <div className={getInputClass(isEmailValid)}>
                        <input type="email" 
                        placeholder="Email" 
                        required
                        value={email}
                        onChange={handleEmailChange}
                        />
                        <IoMail className="icon"/>
                    </div>
                    <div className={getInputClass(isPasswordValid)}>
                        <input type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            required
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <div onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon"/>}
                        </div>
                    </div>
                    <div className={getInputClass(isConfirmPasswordValid)}>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm Password" 
                            required
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <div onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon"/>}
                        </div>
                    </div>
                </div>
                <button className="su-submit" type="submit">Create account</button>
                </form>
                <div className="login">Already have an account? <Link to="/login"><span>Click here!</span></Link></div>
            </div>
        </>    
    )
}

export default SignUp;