import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {login, signup} from "./UserApi";
import {validatePassword, validateUsername} from "./validator";

export const UserStart = () => {

    const history = useHistory();

    const [valid, setValid] = useState({username: null, password: null});

    const [user, setUser] = useState(
        {
            username: "",
            password: "",
            confirmPassword: "",
            authority: "USER",
            jwt: "",
            expiration: "",
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

        const homePageTimeout = setTimeout(() => {
            if (user.outcome === `Welcome back, ${user.username}`) {
                history.push("/home", user);
            }
        }, 2000);

        return () => {
            clearTimeout(textBoxTimeout);
            clearTimeout(homePageTimeout);
        }
    }, [history, user]);

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

    const signupRequest = async () => {
        let response;
        await signup(user, (res) => response = JSON.parse(res));
        setUser({...user, outcome: response.message});
    };

    const loginRequest = async () => {
        let response;
        await login(user, (res) => response = JSON.parse(res));
        if (response.body === undefined) {
            response.body = {jwt: "", expiration: ""};
        }
        setUser({
            ...user,
            jwt: response.body.jwt,
            expiration: response.body.expiration,
            outcome: response.message
        });
    };

    const isNotValidUsername = () => {return valid.username !== "✔"};

    const isNotValidPassword = () => {return valid.password !== "✔"};

    const isNotMatchingPassword = () => {return valid.password !== "Passwords do not match."};

    return (
        <div>
            <h1 className={"title"}>User Start</h1>
            <form>
                <div>
                    <label htmlFor={"name"}>
                        User Name
                        <input type="text" id={"name"} value={user.username}
                               onChange={e => setUser({...user, username: e.target.value})}/>
                    </label>
                    <output data-testid={"usernameValidity"}>{valid.username}</output>
                    <br/>

                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={user.password}
                               onChange={e => setUser({...user, password: e.target.value})}/>
                    </label>
                    <label htmlFor={"confirmPass"}>
                        Confirm Password
                        <input type={"text"} id={"confirmPass"} value={user.confirmPassword}
                               onChange={e => setUser({...user, confirmPassword: e.target.value})}/>
                    </label>
                    <output data-testid={"passwordValidity"}>{valid.password}</output>
                    <br/>

                    <button type={"button"} id={"createButton"}
                            disabled={isNotValidUsername() || isNotValidPassword()}
                            onClick={signupRequest}>Create User
                    </button>
                    <button type={"button"} id={"loginButton"}
                            disabled={(isNotValidUsername()) || (isNotValidPassword() && isNotMatchingPassword())}
                            onClick={loginRequest}>Login
                    </button>

                    <output data-testid={"requestOutcome"} id={"requestOutcome"}>{user.outcome}</output>

                </div>
            </form>

        </div>
    )
};
