import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Card, Label, OutputContainer } from 'components';
import { useMemo } from 'react';

export const ProjectInfo = ({
  selectedFileName,
  structReader
}: {
  selectedFileName: string;
  structReader: StructReader;
}) => {
  const projectInfo: StructProject = useMemo(
    () => structReader.getProject(),
    [structReader]
  );
  return (
    <Card
      className='flex-2'
      key={'projectProperties'}
      title={'Project properties'}
      description={`${selectedFileName} project info`}
      reference={''}
    >
      <OutputContainer>
        <p><Label>Name: </Label>{projectInfo.name}</p>
        <p><Label>Label: </Label>{projectInfo.label}</p>
        <br />
        <p>{projectInfo.description}</p>
      </OutputContainer>
    </Card>
  );
};
