import {useState} from "react";

export const Trade = ({body}) => {
    const [trade, setTrade] = useState({...body})

    console.log(body)

    return (
        <details key={trade.id} className="tradeDetails">
            <summary>{trade.id}</summary>
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