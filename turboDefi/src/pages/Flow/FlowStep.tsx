import StructReader from "StructReader/StructReader";
import { environment } from "config";
import { FlowStepType } from "./Flow";
import { useEffect, useState } from "react";
import { ProjectEndpointForm, ProjectInfo } from "pages/Project/ProjectInfo";
import { EndpointType, ModuleType } from "StructReader";
import StructModule from "StructReader/StructParts/StructModule";
import StructEndpoint from "StructReader/StructParts/StructEndpoint";

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
            }
            );
        }
        return;
    }, []);

    return (
        <>
            {structReader?.isLoaded() && (
                <ProjectEndpointForm
                    module={structReader.getModule(step.module)}
                    endpoint={structReader.getModuleEndpoint(step.module, step.endpoint)}
                    structReader={structReader}
                />
            )}
        </>
    );
}