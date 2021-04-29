import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';

import ProfileCreation from './components/ProfileCreation';

function App() {
    return (
            <div>
                <BrowserRouter>
                    <main>
                        <nav>
                            <ul>
                                <li><Link to="/profile-creation">Profile Creation</Link></li>
                            </ul>
                        </nav>
                        <Switch>
                            <Route path="/profile-creation" component={ProfileCreation} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
    );
}

export default App;
