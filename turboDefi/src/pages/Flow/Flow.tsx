import { Card } from "components";
import { FlowStep } from "./FlowStep";

type FlowType = {
    name: string,
    label: string,
    description: string,
    steps: FlowStepType[]
}

export type FlowStepType = {
    label: string,
    description: string,
    endpoints?: FlowEndpointType[]
    component?: string
}

export type FlowEndpointType = {
    project?: string
    module?: string
    endpoint?: string
}

export const Flow = () => {

    const flowInfo: FlowType = {
        "name": "flow-1",
        "label": "Flow 1",
        "description": "This flow will save a lot of time to the user",
        "steps": [
            {
                "label": "step 1",
                "description": "Claim pending rewards from $CYBER Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "claim"
                    }
                ]
            },
            {
                "label": "step 2",
                "description": "Claim pending rewards from CityNFT Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "claimReward"
                    }
                ]
            },
            {
                "label": "step 3",
                "description": "Swap claimed $CYBER to whatever you want",
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
                    return <FlowStep step={step} key={index} />
                })}
            </Card>
        </div>
    );
}