import { FlowStepType } from "./Flow";
import { AshSwap } from "pages/AshSwap";
import React from "react";

export const ComponentStep = ({
    step
}: {
    step: FlowStepType
}) => {

    const COMPONENTS = {
        "AshSwap": AshSwap
    }

    return (
        <div className="border">
            {React.createElement(COMPONENTS[step.component])}
        </div>
    );
};