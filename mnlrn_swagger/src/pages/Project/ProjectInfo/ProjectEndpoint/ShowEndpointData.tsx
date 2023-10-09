import StructEndpoint from "StructReader/StructParts/StructEndpoint";
import { ShowEndpointContainer } from "./ShowEndpointContainer";
import { Label } from "components";
import { ShowEndpointField } from "./ShowEndpointField";

export const ShowEndpointData = ({
    output,
    endpoint
  }: {
    output: any;
    endpoint: StructEndpoint;
  }) => {
    //console.log(output);
    const label = (output.label ?? output.name) || '';
    if (Array.isArray(output)) {
      //console.log('Is array');
      return (
        <ul>
          <ShowEndpointContainer label={label} output={output}>
            {label != '' && <Label>{label}: </Label>}
            {output.map((element, index) => (
              <li key={index}>
                <ShowEndpointData output={element} endpoint={endpoint} />
              </li>
            ))}
          </ShowEndpointContainer>
        </ul>
      );
    } else if (!output.hasOwnProperty('value')) {
      //console.log('Is a field');
      return <ShowEndpointField output={output} endpoint={endpoint} />;
    } else {
      //console.log('Is an object');
      return (
        <ShowEndpointContainer label={label} output={output}>
          {label != '' && <Label>{label}: </Label>}
          <ShowEndpointData output={output.value} endpoint={endpoint} />
        </ShowEndpointContainer>
      );
    }
  };
  