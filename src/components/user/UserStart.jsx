import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {validatePassword, validateUsername} from "../common/validator";
import "./start.css"
import {HttpRange} from "../common/httpStatus";
import {loginApiModule, signupApiModule, userStartIds} from "./userStartApiModule";
import {useApi} from "../api/useApi";

export const UserStart = () => {

    const history = useHistory();
    const [valid, setValid] = useState({username: null, password: null});
    const [sendLoginRequest, loginResponse,] = useApi();
    const [sendSignupRequest, signupResponse,] = useApi();

    const [user, setUser] = useState(
        {
            username: "",
            password: "",
            confirmPassword: "",
            authority: "USER",
            outcome: ""
        });

    const [textBox, setTextBox] = useState({usernameBox: null, passwordBox: null, confirmPasswordBox: null});

    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            history.push("/home")
        }
    }, [])

    useEffect(() => {
        const textBoxTimeout =
            setTimeout(setTextBox({
                usernameBox: user.username,
                passwordBox: user.password,
                confirmPasswordBox: user.confirmPassword
            }), 500);

        return () => {
            clearTimeout(textBoxTimeout);
        }
    }, [user]);

    useEffect(() => {
        checkTextBoxes();
    }, [textBox]);

    const checkTextBoxes = () => {
        setValid({
            ...valid,
            username: validateUsername(textBox.usernameBox),
            password: validatePassword(textBox.passwordBox, textBox.confirmPasswordBox)
        });
    };

    const handleSignup = () => {
        sendSignupRequest(signupApiModule(user));
    };

    const handleLogin = () => {
        sendLoginRequest(loginApiModule(user, {
            idAction: {
                type: "login",
                execute: (response) => {
                    if (HttpRange.success.test(response.status)) {
                        history.push("/home")
                    }
                }
            }
        }))
    };

    const isNotValidUsername = () => {
        return valid.username !== "✔"
    };

    const isNotValidPassword = () => {
        return valid.password !== "✔"
    };

    const isNotMatchingPassword = () => {
        return valid.password !== "Passwords do not match."
    };

    return (
        <div>
            <h1 className={"title"}>User Start</h1>
            <form>
                <div>
                    <div className={"inputBlock"}>
                        <label htmlFor={"name"}>User Name</label>
                        <input type="text" id={"name"} value={user.username}
                               onChange={e => setUser({...user, username: e.target.value})}/>
                        <output data-testid={"usernameValidity"}
                                data-issuccess={(valid.username === "✔")}>
                            {valid.username}</output>
                    </div>

                    <div className={"inputBlock"}>
                        <label htmlFor={"pass"}>Password</label>
                        <input type={"text"} id={"pass"} value={user.password}
                               onChange={e => setUser({...user, password: e.target.value})}/>
                        <output data-testid={"passwordValidity"}
                                data-issuccess={(valid.password === "✔")}>{valid.password}</output>
                    </div>

                    <div className={"inputBlock"}>
                        <label htmlFor={"confirmPass"}>Confirm Password</label>
                        <input type={"text"} id={"confirmPass"} value={user.confirmPassword}
                               onChange={e => setUser({...user, confirmPassword: e.target.value})}/>
                        <button type={"button"} id={"createButton"}
                                disabled={isNotValidUsername() || isNotValidPassword()}
                                onClick={handleSignup}>Create User
                        </button>
                        <button type={"button"} id={"loginButton"}
                                disabled={(isNotValidUsername()) || (isNotValidPassword() && isNotMatchingPassword())}
                                onClick={handleLogin}>Login
                        </button>
                    </div>

                    <div className={"startOutputs"}>

                        <output id={userStartIds.loginResponse} data-testid={userStartIds.loginResponse}
                                data-issuccess={loginResponse.isSuccess}>{loginResponse.message}</output>

                        <output id={userStartIds.signupResponse} data-testid={userStartIds.signupResponse}
                                data-issuccess={signupResponse.isSuccess}>{signupResponse.message}</output>
                    </div>
                </div>
            </form>

        </div>
    )
};
