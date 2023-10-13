import { FlowStepType } from "./Flow";
import { EndpointStep } from "./EndpointStep";
import { ComponentStep } from "./ComponentStep";
import { Card } from "components";

export const FlowStep = ({
    step
}: {
    step: FlowStepType
}) => {
    return (
        <Card
            className='flex-2 border mb-2'
            key={'flow'}
            title={step.label}
            description={step.description}
            reference={''}
        >
            {step.endpoints ?
                <EndpointStep step={step} />
                :
                <ComponentStep step={step} />
            }
        </Card>
    );
}