import React from "react";
import axios from "axios";

class ProfileCreation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            pass: "",
            message: ""
        }
    }

    handleChange = e => {
        this.setState({[e.target.id]: e.target.value})
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        axios.post("/cryptoProfile", this.state)
            .then((response) => {
                console.log(response.status);
            }, (error) => {
                console.log(error);
            });
    };

    render() {
        const {name, pass} = this.state;
        return (
            <div>
                <h1 className={"title"}>Profile Creation</h1>
                <form
                    onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor={"name"}>
                            Profile Name
                            <input type="text" id={"name"} value={name}
                                   onChange={this.handleChange}/>
                        </label>
                    </div>

                    <div>
                        <label htmlFor={"pass"}>
                            Password
                            <input type={"text"} id={"pass"} value={pass}
                                   onChange={this.handleChange}/>
                        </label>
                    </div>

                    <div>
                        <input type={"submit"} id={"submit"} value={"Create New Profile"}/>
                    </div>
                </form>
            </div>
        )
    }
}

export default ProfileCreation