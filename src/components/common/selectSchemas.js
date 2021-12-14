export const strategySelect = (onChange) => {
    return {
        type: "Strategy",
        id: "loadStrategiesSelect",
        defaultAction: () => null,
        doAction: (selection) => onChange(selection)
    }
}