import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';

import UserCreation from "./components/user/UserCreation";



function App() {
    return (
            <div>
                <BrowserRouter>
                    <main>
                        <nav>
                            <ul>
                                <li><Link to="/authenticate">User Creation</Link></li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path="/authenticate" component={UserCreation} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
    );
}

export default App;
