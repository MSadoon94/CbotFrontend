import {DynamicTextBox} from "../common/DynamicTextBox";

export const RefineStrategy = ({update, overwrite = ""}) => {
    return (
        <>
            <details id={"refineDetails"}>
                <summary>Refine Strategy</summary>
                <label htmlFor={"stopLossInput"}>Stop-Loss</label>
                <DynamicTextBox id={"stopLossInput"} overwrite={overwrite.stopLoss}
                                onTyping={(res) => {update.stopLoss(res.entry)}} options={{type: "number"}}/>
            </details>
        </>
    )
}