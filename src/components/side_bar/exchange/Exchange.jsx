import React, {useState} from "react";
import "./exchange.css"

export const Exchange = ({initial}) => {
    const [exchange, setExchange] = useState(initial);

    return (
        <details id={exchange.name}>
            <summary>{exchange.name}</summary>
            <table>
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {exchange.balances.map(([{currency, amount}]) =>
                    <React.Fragment key={exchange.name + currency}>
                        <tr>
                            <th>{currency}</th>
                            <td>{amount}</td>
                        </tr>
                    </React.Fragment>
                )}
                </tbody>
            </table>
        </details>
    )
};