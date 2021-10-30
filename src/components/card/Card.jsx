import React, {useState} from "react";
import "./card.css"

export const Card = ({cardData}) => {
    const [card, setCard] = useState({...cardData, isClosed: false});

    return (
        <>
            <button type={"button"} className={"hideButton"} hidden={card.isClosed} onClick={
                () => setCard({...card, isHidden: !(card.isHidden)})}>
                {card.isHidden ? "Show" : "Hide"}</button>

            <button type={"button"} className={"closeButton"} hidden={card.isClosed} onClick={
                () => setCard({...card, isHidden: true, isClosed: true})
            }>X</button>

            <div hidden={card.isHidden} id={card.name}>
                <table>
                    <thead>
                    <tr>
                        <th colSpan={2}>{card.name}</th>
                    </tr>
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
            </div>
        </>
    )
};