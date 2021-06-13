import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';

import UserStart from "./components/user/UserStart";



function App() {
    return (
            <div>
                <BrowserRouter>
                    <main>
                        <nav>
                            <ul>
                                <li><Link to={"/start"}>User Start</Link></li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path={"/start"} component={UserStart} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
    );
}

export default App;
