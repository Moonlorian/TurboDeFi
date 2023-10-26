import StructEndpoint from "StructReader/StructParts/StructEndpoint";
import { useGetTokenInfo } from "hooks";
import { Fragment } from "react";
import { FormatEndpointField } from "./FormatEndpointField";

export const ShowEndpointField = ({
  output,
  endpoint
}: {
  output: any;
  endpoint: StructEndpoint;
}) => {
  const tokenInfo = useGetTokenInfo();
  const className = output.constructor.name;

  if (className == 'Object') {
    const fieldList = Object.values(output);
    return (
      <div className={`${output.balance ? 'font-weight-bold' : ''}`}>
        {fieldList.map((newOutput: any, index) => (
          <Fragment key={index}>
            {!newOutput.hidden && (
              <FormatEndpointField output={output} field={newOutput} endpointVars={endpoint.vars} />
            )}
          </Fragment>
        ))}
      </div>
    );
  } else {
    return <FormatEndpointField output={output} field={output} endpointVars={endpoint.vars} />;
  }
};