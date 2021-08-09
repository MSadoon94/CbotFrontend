import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {login, signup} from "./UserApi";
import {validateUsername} from "./validator";

export const UserStart = () => {

    const history = useHistory();

    const [valid, setValid] = useState({username: null, confirmPass: null,});

    const [user, setUser] = useState(
        {
            username: "",
            password: "",
            authority: "USER",
            jwt: "",
            expiration: "",
            outcome: ""
        });

    const [usernameTextbox, setUsernameTextbox] = useState();

    useEffect(() => {
        const usernameTextBoxTimeout = setTimeout(setUsernameTextbox(user.username), 500);

        const homePageTimeout = setTimeout(() => {
            if (user.outcome === `Welcome back, ${user.username}`) {
                history.push("/home", user);
            }
        }, 2000);

        return () => {
            clearTimeout(usernameTextBoxTimeout);
            clearTimeout(homePageTimeout);
        }
    }, [history, user]);

    useEffect(() => {
        checkUsername();
    }, [usernameTextbox]);


    const checkUsername = () => {
        setValid({...valid, username: validateUsername(user.username)});
    };

    const signupRequest = async () => {
        let response;
        await signup(user, (res) => response = JSON.parse(res));
        setUser({...user, outcome: response.message});
        if(response.message === "Username has been taken, please choose another."){
            setValid({...valid, username: response.message});
        }
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
                    <output id={"usernameValidity"}>{valid.username}</output><br/>


                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={user.password}
                               onChange={e => setUser({...user, password: e.target.value})}/>
                    </label><br/>

                    <button type={"button"} id={"createButton"} disabled={valid.username !== "✔"}
                            onClick={signupRequest}>Create User
                    </button>
                    <button type={"button"} id={"loginButton"}  disabled={valid.username !== "✔"}
                            onClick={loginRequest}>Login
                    </button>

                    <label className={"outcome"} id={"requestOutcome"}>{user.outcome}</label>

                </div>
            </form>

        </div>
    )
};
