import React, {useState} from "react";
import {login, signup} from "./UserApi";

export function UserStart() {

    const [user, setUser] = useState({username: "", password: "", authority: "USER"});
    const [outcome, setOutcome] = useState();
    const [jwt, setJwt] = useState("");

    const signupRequest = async () => {
        let response;
        await signup(user, (res) => response = JSON.parse(res));
        setOutcome(response.message);
    }

    const loginRequest = async () => {
        let response;
        await login(user, (res) => response = JSON.parse(res));
        setOutcome(response.message);
        setJwt(response.jwt);
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

                    <label className={"outcome"}>{outcome}</label>
                </div>
            </form>
        </div>
    )
}
