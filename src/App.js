import {Route, Routes} from 'react-router-dom';
import './App.css';
import {UserStart} from "./components/user/UserStart";
import {Home} from "./components/home/Home";
import React, {createContext, useRef, useState} from "react";
import {urls} from "./components/util/historyUtil";
import {useSessionManager} from "./components/util/useSessionManager";
import SockJsClient from "react-stomp";
import {websocketMappings} from "./components/api/websocketMappings";

export const initialId = {
    username: "",
    expiration: "",
    isLoggedIn: false
};
export const SessionContext = createContext({});
export const WebSocketContext = createContext({});

export const SOCKET_URI = "http://localhost:8080/socket"

function App() {
    const [setSession] = useSessionManager();
    const [messages, setMessages] = useState(websocketMappings);
    const wsClient = useRef();

    return (
        <SessionContext.Provider value={setSession}>
            <SockJsClient
                url={SOCKET_URI}
                topics={Object.keys(websocketMappings)}
                onMessage={(msg, destination) => setMessages({...messages, [destination]: msg})}
                ref={client => wsClient.current = client}
                debug={true}
            />
            <WebSocketContext.Provider value={{wsMessages: messages, wsClient: wsClient}}>
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
            </WebSocketContext.Provider>
        </SessionContext.Provider>
    )
        ;
}

export default App;
