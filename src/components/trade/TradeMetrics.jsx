import Chart from "react-apexcharts";
import {useContext, useEffect, useState} from "react";
import {WebSocketContext} from "../../App";
import "./trade.css"
export const TradeMetrics = ({trade, hidden}) => {
    const {wsMessages, wsClient} = useContext(WebSocketContext);
    const [options, setOptions] = useState({
        xaxis: {
            type: 'datetime'
        }
    });
    const [series, setSeries] = useState({
        data: []
    })
    const endpoints = {
        candle: `/topic/metrics/candle/${trade.strategyName}`
    }

    useEffect(() => {
        if(wsMessages[endpoints.candle]){
            let timestamp = JSON.parse(wsMessages[endpoints.candle][0]);
            wsMessages[endpoints.candle][0] = JSON.parse(timestamp);
            let message = [...series.data, wsMessages[endpoints.candle]]
            setSeries({data: message})
        }
    }, [wsMessages[endpoints.candle]])

    return (
        <div className="tradeMetricBox" role="figure" hidden={hidden}>
            <Chart type="candlestick"
                   options={options}
                   series={[series]}/>
        </div>
    )
}