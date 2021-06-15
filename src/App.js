import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';

import {UserStart} from "./components/user/UserStart";
import {UserHome} from "./components/user/UserHome";



function App() {
    return (
            <div>
                <BrowserRouter>
                    <main>
                        <Switch>
                            <Route exact path={"/start"} component={UserStart} />
                            <Route exact path={"/user-home"} component={UserHome} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
    );
}

export default App;
