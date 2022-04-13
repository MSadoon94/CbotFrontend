import {useRef, useState} from "react";
import {SOCKET_URI} from "../../App";
import SockJsClient from "react-stomp";
import {exchanges} from "../common/exchanges";

export const CredentialManager = () => {
    const [credentials, setCredentials] = useState({exchange: "", account: "", password: ""})
    const [messages, setMessages] = useState({
        "/app/add-credentials": {payload: "", headers: {}},
        "/topic/rejected-credentials": {payload: "", headers: {}}
    })
    const ws = useRef();

    return (
        <div className="credentialManager">

            <SockJsClient
                url={SOCKET_URI}
                topics={["/topic/rejected-credentials"]}
                onMessage={(msg, topic) => setMessages({...messages, [topic]: msg})}
                ref={client => ws.current = client}
            />

            <label htmlFor="exchangeNameSelect">Exchange Name</label>
            <select id="exchangeNameSelect"
                    onClick={e => setCredentials({...credentials, exchange: e.target.value})}>
                {Object.keys(exchanges)
                    .map(exchange => <option id={`${exchange}Option`} key={`${exchange}Option`}
                                             value={exchanges[exchange]}>{exchange}</option>)
                }
            </select>

            <label htmlFor="accountInput">Account</label>
            <input id="accountInput" value={credentials.account}
                   onChange={e => setCredentials({...credentials, account: e.target.value})}/>

            <label htmlFor="passwordInput">Password</label>
            <input id="passwordInput" value={credentials.password}
                   onChange={e => setCredentials({...credentials, password: e.target.value})}/>

            <button type="button" id="addCredentialsButton"
                    onClick={() => ws.current.sendMessage("/app/add-credentials", JSON.stringify(credentials))}>
                Add Credentials
            </button>

            <output id="addCredentialsResponse" data-testid="addCredentialsResponse"
                    data-issuccess={Object.keys(messages["/app/add-credentials"].headers).includes("Error")}>
                {messages["/app/add-credentials"].payload}
            </output>

            <output id="rejectedCredentialsResponse" data-testid="rejectedCredentialsResponse"
                    data-issuccess={!messages["/topic/rejected-credentials"].payload}>
                {messages["/topic/rejected-credentials"].payload}
            </output>
        </div>
    )
}