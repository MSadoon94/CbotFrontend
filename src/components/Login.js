import React from 'react'

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            pname: "",
            pass: ""
        }
    }

    handleProfileNameChange = (event) => {
        this.setState({
            pname: event.target.value
        })
    };

    handlePasswordChange = (event) => {
        this.setState(
            {
                pass: event.target.value
            }
        )
    }

    render() {
        return (
        <div>
            <h1 className={"title"}>Login</h1>
            <form>
                <div>
                    <label htmlFor={"pname"}>
                        Profile Name
                    </label>
                    <input type="text" id={"pname"} value={this.state.pname}
                           onChange={this.handleProfileNameChange}/>
                </div>

                <div>
                    <label htmlFor={"pass"}>
                        Password
                        <input type={"text"} id={"pass"} value={this.state.pass}
                               onChange={this.handlePasswordChange}/>
                    </label>
                </div>

                <div>
                    <input type={"submit"} id={"submit"} value={"Login"}/>
                </div>
            </form>
        </div>
        );
    }
}

export default Login