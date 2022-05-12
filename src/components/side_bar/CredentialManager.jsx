import {useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";
import {exchanges} from "../common/exchanges";

export const CredentialManager = () => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [credentials, setCredentials] = useState({exchange: "", account: "", password: ""})
    const [response, setResponse] = useState("");
    const [rejectCredentials, setRejectCredentials] = useState({exchange: null, message: null});

    useEffect(() => {
        let message = wsMessages["/topic/rejected-credentials"];
        if (message) {
            setRejectCredentials(message);
            setTimeout(() => setRejectCredentials(null), 3000);
        }

    }, [wsMessages["/topic/rejected-credentials"]])

    useEffect(() => {
        let message = wsMessages["/topic/add-credentials"];
        if (message) {
            setResponse(message);
            setTimeout(() => setResponse(""), 3000);
        }
    }, [wsMessages["/topic/add-credentials"]])

    return (
        <div className="credentialManager">

            <label htmlFor="exchangeNameSelect">Exchange Name</label>
            <select id="exchangeNameSelect" defaultValue={exchanges.Kraken}
                    onClick={e => setCredentials({...credentials, exchange: e.target.value})}>
                {Object.keys(exchanges)
                    .map(exchange => <option id={`${exchange}Option`} key={`${exchange}Option`}
                                             defaultValue={exchanges[exchange] === exchanges.Kraken}
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
                    onClick={() => wsClient.current.sendMessage(
                        "/app/add-credentials",
                        JSON.stringify(credentials))}>
                Add Credentials
            </button>

            <output id="addCredentialsResponse" data-testid="addCredentialsResponse"
                    data-issuccess={!rejectCredentials}>
                {rejectCredentials.message ? "" : response}
            </output>

            <output id="rejectedCredentialsResponse" data-testid="rejectedCredentialsResponse"
                    data-issuccess={!rejectCredentials}>
                {rejectCredentials ? rejectCredentials.message : ""}
            </output>
        </div>
    )
}