import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Card, Label, OutputContainer } from 'components';
import { DashBorardStructReaderContext } from 'pages/Dashboard/Dashboard';
import { useContext, useMemo } from 'react';

export const ProjectInfo = () => {
  const dashBorardStructReaderContext = useContext(
    DashBorardStructReaderContext
  );

  const projectInfo: StructProject = useMemo(
    () => dashBorardStructReaderContext.structReader.getProject(),
    [dashBorardStructReaderContext.structReader]
  );
  return (
    <Card
      className='flex-2'
      key={'projectProperties'}
      title={'Project properties'}
      description={`${dashBorardStructReaderContext.selectedFileName} project info`}
      reference={''}
    >
      <OutputContainer>
        <p>
          <Label>Name: </Label>
          {projectInfo.name}
        </p>
        <p>
          <Label>Label: </Label>
          {projectInfo.label}
        </p>
        <br />
        <p>{projectInfo.description}</p>
      </OutputContainer>
    </Card>
  );
};
