import React, {useState} from "react";
import "./card.css"

export const Card = ({cardData}) => {
    const [card, setCard] = useState(cardData);

    return (
        <details id={card.name}>
            <summary>{card.name}</summary>
            <table>
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {card.balances.map(([{currency, amount}]) =>
                    <React.Fragment key={card.name + currency}>
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