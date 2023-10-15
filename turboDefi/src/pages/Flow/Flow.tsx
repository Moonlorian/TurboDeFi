import { Card } from "components";
import { FlowStep } from "./FlowStep";
import { Flows } from "./Flows";

type FlowType = {
    name: string,
    label: string,
    description: string,
    steps: FlowStepType[]
}

export type FlowStepType = {
    label?: string,
    description: string,
    endpoints?: FlowEndpointType[]
    component?: string
    componentProps?: {
        defaultTokenFrom?: string,
        defaultTokenTo?: string
    }
}

export type FlowEndpointType = {
    project?: string
    module?: string
    endpoint?: string
}

export const Flow = () => {

    const flow: FlowType = Flows['flow_2'];

    return (
        <div className='flex flex-col gap-6 max-w-7xl w-full'>
            <Card
                className='flex-2'
                key={'flow'}
                title={flow.label}
                description={flow.description}
                reference={''}
            >
                {flow.steps.map((step, index) => {
                    return <FlowStep step={step} key={index} index={index + 1} />
                })}
            </Card>
        </div>
    );
}