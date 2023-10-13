import { FlowStepType } from "./Flow";
import { EndpointStep } from "./EndpointStep";
import { ComponentStep } from "./ComponentStep";
import { Card } from "components";

export const FlowStep = ({
    step,
    index
}: {
    step: FlowStepType,
    index: number
}) => {
    return (
        <span className="flex flex-col rounded-xl p-6 border mb-2">
            <h5 className="flex items-center">
                <span className="rounded-full bg-main-color text-white w-[35px] h-[35px] flex items-center justify-center m-3">
                    {index}
                </span>
                <p className='text-gray-400 m-0'>{step.description}</p>
            </h5>
            <Card
                className='flex-2 p-1'
                key={'flow'}
                title={step.label || ''}
                description={''}
                reference={''}
            >
                {step.endpoints ?
                    <EndpointStep step={step} />
                    :
                    <ComponentStep step={step} props={step.componentProps} />
                }
            </Card>
        </span>
    );
}