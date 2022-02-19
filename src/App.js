import {Route, Routes} from 'react-router-dom';
import './App.css';
import {UserStart} from "./components/user/UserStart";
import {Home} from "./components/home/Home";
import React, {createContext} from "react";
import {urls} from "./components/util/historyUtil";
import {useSessionManager} from "./components/util/useSessionManager";

export const initialId = {
    username: "",
    expiration: "",
    isLoggedIn: false
};
export const SessionContext = createContext({});

export const SOCKET_URI = "http://localhost:8080/socket"

function App() {
    const [setSession] = useSessionManager();

    return (
        <SessionContext.Provider value={setSession}>
            <Routes>
                <Route path={urls.start} element={<UserStart/>}/>
                <Route path={urls.home} element={<Home/>}/>
                <Route
                    path="*"
                    element={
                        <main style={{padding: "1rem"}}>
                            <p>There's nothing here!</p>
                        </main>
                    }
                />
            </Routes>
        </SessionContext.Provider>
    )
        ;
}

export default App;
