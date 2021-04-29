import {Route, Switch} from 'react-router-dom';
import './App.css';

import {UserStart} from "./components/user/UserStart";
import {Home} from "./components/home/Home";


function App() {
    return (
        <div>
            <main>
                <Switch>
                    <Route exact path={"/start"} component={UserStart}/>
                    <Route exact path={"/home"} component={Home}/>
                </Switch>
            </main>
        </div>
    );
}

export default App;
