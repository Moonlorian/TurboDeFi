import StructReader from "StructReader/StructReader";
import { ProjectEndpointForm } from "pages/Project/ProjectInfo";
import { FlowStepType } from "./Flow";

export const EndpointStep = ({
    structReader,
    step
}: {
    structReader?: StructReader,
    step: FlowStepType
}) => {
    if (!structReader) return;
    return (
        structReader?.isLoaded() ? (
            <ProjectEndpointForm
                module={structReader.getModule(step.module)}
                endpoint={structReader.getModuleEndpoint(step.module, step.endpoint)}
                structReader={structReader}
            />
        ) : (
            <></>
        )
    );
};