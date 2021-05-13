import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';

import ProfileCreation from "./components/profile/ProfileCreation";
import Login from './components/Login';


function App() {
    return (
            <div>
                <BrowserRouter>
                    <main>
                        <nav>
                            <ul>
                                <li><Link to="/cryptoProfile">Profile Creation</Link></li>
                                <li><Link to="/login">Login</Link></li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path="/cryptoProfile" component={ProfileCreation} />
                            <Route path="/login" component={Login}/>
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
    );
}

export default App;
