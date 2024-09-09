import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import "./SignUp.css";
import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../components/regular expressions";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const [user_name, setUserName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isUserNameValid, setIsUserNameValid] = useState(false); 
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!USER_REGEX.test(user_name)) {
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

        const userData = {
            email: email,
            password: password,
            user_name: user_name
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/strona/register/", userData, {
                headers: {
                    "Content-Type": "application/json",
                }, 
                withCredentials: true
            });

            if (response.data.success) {
                alert(response.data.message);

                localStorage.setItem('id_token', response.data.id_token);
                localStorage.setItem('expires_in', response.data.expires_in);
                localStorage.setItem('user_name', response.data.user_name); 

                setUserName(""); 
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setIsUserNameValid(false); 
                setIsEmailValid(false);
                setIsPasswordValid(false);
                setIsConfirmPasswordValid(false);
                navigate("/", { state: { user_name: user_name } });

            } else {
                alert(response.data.message);
            }

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || "There was an error creating your account. Please try again.";
                alert(errorMessage);
            } else {
                alert("There was an unknown error. Please try again.");
            }
        }
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserName(value); 
        setIsUserNameValid(USER_REGEX.test(value)); 
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
    };

    const getInputClass = (isValid: boolean) => {
        return isValid ? "input valid" : "input invalid";
    };

    return (
        <>
            <Navbar onSearchTerm={() => { }} />
            <div className="container">
                <div className="su-header">
                    <div className="text">Sign Up</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="su-inputs">
                        <div className={getInputClass(isUserNameValid)}>
                            <input type="text"
                                placeholder="Username"
                                required
                                value={user_name} 
                                onChange={handleUserNameChange} 
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className={getInputClass(isEmailValid)}>
                            <input type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <IoMail className="icon" />
                        </div>
                        <div className={getInputClass(isPasswordValid)}>
                            <input type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <div onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
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
                                {showConfirmPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
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
