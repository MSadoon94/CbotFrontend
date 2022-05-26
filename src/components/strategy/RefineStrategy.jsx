import {DynamicTextBox} from "../common/DynamicTextBox";
import {Fragment} from "react";

export const RefineStrategy = ({update, overwrite = ""}) => {
    const refinements = {
        stopLoss: "Stop-Loss",
        maxPosition: "Max Position",
        targetProfit: "Target Profit",
        movingStopLoss: "Moving Stop-Loss",
        maxLoss: "Max Loss",
    }
    return (
        <div className="refineDetailsBox">
            {Object.keys(refinements).map((type) =>
                <Fragment key={type}>
                    <label htmlFor={`${type}Input`}>{refinements[type]}</label>
                    <DynamicTextBox id={`${type}Input`} overwrite={overwrite[type]}
                                    onTyping={(res) => update[type](res.entry)} options={{type: "number"}}/>
                </Fragment>
            )}
        </div>
    )
}