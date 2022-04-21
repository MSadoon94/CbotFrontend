import {useState} from "react";

export const Trade = ({body}) => {
    const [trade, setTrade] = useState({...body})

    return (
        <details key={trade.id} className="tradeDetails">
            <summary>{trade.label ? trade.label : trade.strategyName}</summary>
            <table>
               <tbody>
               <tr>
                   <th>Status</th>
                   <td>{trade.status}</td>
               </tr>
               </tbody>
            </table>
        </details>
    )
}