import StructModule from 'StructReader/StructParts/StructModule';
import StructProject from 'StructReader/StructParts/StructProject';
import StructReader from 'StructReader/StructReader';
import { Card, Label, OutputContainer } from 'components';
import { useMemo } from 'react';
import { ProjectEndpoints } from '../ProjectEndpoints';

export const ProjectModules = ({
  selectedFileName,
  structReader
}: {
  selectedFileName: string;
  structReader: StructReader;
}) => {
  const projectModulesList: StructModule[] = useMemo(
    () => structReader.getModules(),
    [structReader]
  );
  return (
    <Card
      className='flex-2'
      key={'projectModules'}
      title={'Project modules'}
      description={`${selectedFileName} project modules`}
      reference={''}
    >
      {projectModulesList.map((module: StructModule, index: any) => (
        <Card
          className='border-1 mb-3'
          key={index}
          title={module.label}
          description={module.description}
          reference={''}
        >
          <Card
            key={`${module.name}_endpoints`}
            title={'Endpoints'}
            description={''}
            reference={''}
          >
            <ProjectEndpoints
              selectedFileName={selectedFileName}
              structReader={structReader}
              selectedModule={module}
            />
          </Card>
        </Card>
      ))}
    </Card>
  );
};
