import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {login, signup} from "./UserApi";

export const UserStart = () => {

    const history = useHistory();

    const [user, setUser] = useState(
        {
            username: "",
            password: "",
            authority: "USER",
            jwt: "",
            expiration: "",
            outcome: ""
        });

    useEffect(() => {
        setTimeout(() => {
            if (user.outcome === `Welcome back, ${user.username}`) {
                history.push("/home", user);
            }
        }, 2000)

    }, [history, user]);

    const signupRequest = async () => {
        let response;
        await signup(user, (res) => response = JSON.parse(res));
        setUser({...user, outcome: response.message})
    }

    const loginRequest = async () => {
        let response;
        await login(user, (res) => response = JSON.parse(res));
        setUser({
            ...user,
            jwt: response.body.jwt,
            expiration: response.body.expiration,
            outcome: response.message
        });
    }

    return (
        <div>
            <h1 className={"title"}>User Start</h1>
            <form>
                <div>
                    <label htmlFor={"name"}>
                        User Name
                        <input type="text" id={"name"} value={user.username}
                               onChange={e => setUser({...user, username: e.target.value})}/>
                    </label><br/>

                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={user.password}
                               onChange={e => setUser({...user, password: e.target.value})}/>
                    </label><br/>
                    <button type={"button"} id={"createButton"}
                            onClick={signupRequest}>Create User
                    </button>
                    <button type={"button"} id={"loginButton"}
                            onClick={loginRequest}>Login
                    </button>

                    <label className={"outcome"}>{user.outcome}</label>

                </div>
            </form>

        </div>
    )
}
