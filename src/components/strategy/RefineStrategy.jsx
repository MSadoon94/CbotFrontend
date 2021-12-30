import {DynamicTextBox} from "../common/DynamicTextBox";
import {Fragment} from "react";
import "./modal.css";

export const RefineStrategy = ({update, overwrite = ""}) => {
    const refinements = {
        stopLoss: "Stop-Loss",
        maxPosition: "Max Position",
        targetProfit: "Target Profit",
        movingStopLoss: "Moving Stop-Loss",
        maxLoss: "Max Loss",
        longEntry: "Long Entry"
    }
    return (
        <>
            <details id={"refineDetails"}>
                <summary>Refine Strategy</summary>

                {Object.keys(refinements).map((type) =>
                        <Fragment key={type}>
                            <label htmlFor={`${type}Input`}>{refinements[type]}</label>
                            <DynamicTextBox id={`${type}Input`} overwrite={overwrite[type]}
                                            onTyping={(res) => update[type](res.entry)} options={{type: "number"}}/>
                        </Fragment>
                )}
            </details>
        </>
    )
}