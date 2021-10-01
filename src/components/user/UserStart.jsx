import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {validatePassword, validateUsername} from "./validator";
import "./start.css"
import {publicConfig} from "../api/apiUtil";
import {create, load} from "../api/responseTemplates";
import {HttpRange} from "../common/httpStatus";
import {ApiResponse} from "../api/ApiResponse";


export const UserStart = () => {

    const history = useHistory();
    const [valid, setValid] = useState({username: null, password: null});
    const [request, setRequest] = useState();

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

    let signupConfig = publicConfig({url: "/api/signup", method: "post"}, user);

    let loginConfig = publicConfig({url: "/api/login", method: "post"}, user);


    const checkTextBoxes = () => {
        setValid({
            ...valid,
            username: validateUsername(textBox.usernameBox),
            password: validatePassword(textBox.passwordBox, textBox.confirmPasswordBox)
        });
    };


    const handleSignup = async () => {
        setRequest({config: signupConfig, templates: create("User")});
    };

    const handleLogin = () => {
        let actions = {
            idAction: {
                type: "login",
                execute: (response) => {
                    if (HttpRange.success.test(response.status)) {
                        history.push("/home")
                    }
                }
            }
        };
        setRequest({config: loginConfig, templates: load("User"), actions});
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
                                className={(valid.username === "✔" ? "valid" : "invalid")}>{valid.username}</output>
                    </div>

                    <div className={"inputBlock"}>
                        <label htmlFor={"pass"}>Password</label>
                        <input type={"text"} id={"pass"} value={user.password}
                               onChange={e => setUser({...user, password: e.target.value})}/>
                        <output data-testid={"passwordValidity"}
                                className={(valid.password === "✔" ? "valid" : "invalid")}>{valid.password}</output>
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

                    <div className={"apiResponse"}>
                        <ApiResponse cssId={"startResponse"} request={request}/>
                    </div>
                </div>
            </form>

        </div>
    )
};
