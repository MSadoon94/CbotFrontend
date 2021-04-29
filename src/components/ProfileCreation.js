import React from 'react';

class ProfileCreation extends React.Component{

    render() {
        return(
            <div>
                <h1 className={"title"}>Profile Creation</h1>
                <form>
                    <label htmlFor={"pname"} >
                        Profile Name
                        <input type="text" id={"pname"} name={"pname"}/>
                    </label><br/>
                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} name={"pass"}/>
                    </label><br/>
                    <input type={"submit"} value={"Create New Profile"}/>
                </form>
            </div>
            )
    }
}
export default ProfileCreation