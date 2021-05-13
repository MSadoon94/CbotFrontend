import React, {useState} from "react";
import axios from "axios";

function ProfileCreation(){

    const [profile, setProfile] = useState({name: "", pass: ""});
    const [outcome, setOutcome] = useState();

    const handleSubmit = event => {
        event.preventDefault();
        console.log(profile);
        axios.post("/cryptoProfile", {profile})
            .then((response) => {
                console.log(response.status);
                setOutcome(`${profile.name} was created successfully.`);
            }, (error) => {
                console.log(error);
                setOutcome("Error: profile could not be created.")
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
                    </label><br/>

                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={profile.pass}
                               onChange={e => setProfile({...profile, pass: e.target.value})}/>
                    </label><br/>

                    <input type={"submit"} id={"submit"} value={"Create New Profile"}/>
                    <label className={"outcome"} >{outcome}</label>
                </div>
            </form>
        </div>
    )
}
    export default ProfileCreation
