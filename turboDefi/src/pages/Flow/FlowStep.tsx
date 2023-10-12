import StructReader from "StructReader/StructReader";
import { environment } from "config";
import { FlowStepType } from "./Flow";
import { useEffect, useState } from "react";
import { EndpointStep } from "./EndpointStep";
import { ComponentStep } from "./ComponentStep";
import { Card } from "components";

export const FlowStep = ({
    step
}: {
    step: FlowStepType
}) => {

    const [structReader, setStructReader] = useState<StructReader>();

    const selectProject = async (selectedProject: string) => {
        const newStructReader = new StructReader(
            '/projects/' + environment + '/' + selectedProject.toLowerCase()
        );
        await newStructReader.load();
        return newStructReader;
    };

    useEffect(() => {
        if (step.project) {
            selectProject(step.project).then((newStructReader: StructReader) => {
                setStructReader(newStructReader);
            });
        }
        return;
    }, []);

    return (
        <Card
            className='flex-2 border mb-2'
            key={'flow'}
            title={step.label}
            description={step.description}
            reference={''}
        >
            {step.project ?
                <EndpointStep structReader={structReader} step={step} />
                :
                <ComponentStep step={step} />
            }
        </Card>
    );
}