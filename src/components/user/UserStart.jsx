import React, {useState} from "react";
import axios from "axios";
import { login } from "./UserApi";

function UserStart(){

    const [user, setUser] = useState({username: "", password: "", authority: "USER"});
    const [outcome, setOutcome] = useState();
    const [jwt, setJwt] = useState("");


    const createUser = () => {
        console.log(user);
        axios.post("/signup", user)
            .then((response) => {
                console.log(response.status);
                setOutcome(`${user.username} was created successfully.`);
            }, (error) => {
                console.log(error);
                setOutcome("Error: user could not be created.")
            });
    };

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

                    {/*<input type={"submit"} id={"submit"} value={"Create New Profile"}/>*/}
                    <button type={"button"} id={"createButton"}
                            onClick={createUser}>Create User</button>
                    <button type={"button"} id={"loginButton"}
                            onClick={loginRequest}>Login</button>

                    <label className={"outcome"} >{outcome}</label>
                </div>
            </form>
        </div>
    )
}
    export default UserStart
