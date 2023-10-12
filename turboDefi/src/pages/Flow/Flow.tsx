import StructReader from "StructReader/StructReader";
import { Card } from "components";
import { environment } from "config";
import { AshSwap } from 'pages/AshSwap';
import React, { useEffect, useState } from "react";
import { FlowStep } from "./FlowStep";

type FlowType = {
    name: string,
    label: string,
    description: string,
    steps: FlowStepType[]
}

export type FlowStepType = {
    label: string,
    description: string
    component?: string
    project?: string
    module?: string
    endpoint?: string
}

export const Flow = () => {

    const COMPONENTS = {
        "AshSwap": AshSwap
    }

    const flowInfo: FlowType = {
        "name": "flow-1",
        "label": "Flow 1",
        "description": "This flow will save a lot of time to the user",
        "steps": [
            {
                "label": "Label of step 1",
                "description": "Description of step 1",
                "project": "xExchange",
                "module": "wrap",
                "endpoint": "wrapEgld"
            },
            {
                "label": "Label of step 2",
                "description": "Description of step 2",
                "component": "AshSwap"
            }
        ]
    }

    return (
        <div className='flex flex-col gap-6 max-w-7xl w-full'>
            <Card
                className='flex-2'
                key={'flow'}
                title={flowInfo.label}
                description={flowInfo.description}
                reference={''}
            >
                {flowInfo.steps.map((step, index) => {
                    if (step.project) {
                        return (
                            <FlowStep step={step} key={index} />
                        );
                    } else {
                        return (
                            <Card
                                className='flex-2 border mb-3'
                                key={'step_' + index}
                                title={step.label}
                                description={step.description}
                                reference={''}
                            >
                                {React.createElement(COMPONENTS[step.component])}
                            </Card>
                        );
                    }
                })}
            </Card>
        </div>
    );
}