import { Card } from "components";
import { FlowStep } from "./FlowStep";
import { Flows } from "./Flows";
import { useEffect, useState } from "react";
import TurbodefiContractService from "services/TurbodefiContractService";
import { API_URL } from "config";

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
    id: number
    project?: string
    module?: string
    endpoint?: string
}

export const Flow = () => {

    const [flow, setFlow] = useState<FlowType>();

    const turbodefiContractService = new TurbodefiContractService(API_URL);

    const loadEndpoints = async () => {
        const flow: FlowType = Flows['flow_1'];

        for (let j = 0; j < flow.steps.length; j++) {
            const step = flow.steps[j];
            if (step.endpoints) {
                const endpoints: FlowEndpointType[] = []
                for (let i = 0; i < step.endpoints.length; i++) {
                    const endpoint = await turbodefiContractService.getEndpointById(step.endpoints[i].id);
                    endpoints.push(endpoint);
                }
                step.endpoints = endpoints;
            }
        };
        return flow;
    }

    useEffect(() => {
        loadEndpoints().then((updatedFlow: FlowType) =>
            setFlow(updatedFlow)
        );
    }, []);

    return (
        <>
            {flow && (
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
            )}
        </>
    );
}