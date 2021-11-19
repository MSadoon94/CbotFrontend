import {Route, Switch} from 'react-router-dom';
import './App.css';
import {UserStart} from "./components/user/UserStart";
import {Home} from "./components/home/Home";
import {ApiManager} from "./components/api/ApiManager";

export const initialId = {
    username: "",
    expiration: "",
    isLoggedIn: false
};

function App() {



    return (
            <main>
                <Switch>
                    <ApiManager userId={initialId}>
                        <Route exact path={"/start"} component={UserStart}/>
                        <Route exact path={"/home"} component={Home}/>
                    </ApiManager>
                </Switch>
            </main>
    );
}

export default App;
