import React, {useState} from "react";
import axios from "axios";

function ProfileCreation(){

    const [profile, setProfile] = useState({name: "", pass: ""});

    const handleSubmit = event => {
        event.preventDefault();
        console.log(profile);
        axios.post("/cryptoProfile", {profile})
            .then((response) => {
                console.log(response.status);
            }, (error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h1 className={"title"}>Profile Creation</h1>
            <form
                onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={"name"}>
                        Profile Name
                        <input type="text" id={"name"} value={profile.name}
                               onChange={e => setProfile({...profile, name: e.target.value})}/>
                    </label>
                </div>

                <div>
                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={profile.pass}
                               onChange={e => setProfile({...profile, pass: e.target.value})}/>
                    </label>
                </div>

                <div>
                    <input type={"submit"} id={"submit"} value={"Create New Profile"}/>
                </div>
            </form>
        </div>
    )
}
    export default ProfileCreation
