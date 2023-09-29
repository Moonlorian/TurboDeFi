import StructModule from 'StructReader/StructParts/StructModule';
import { Card } from 'components';
import { useContext, useMemo } from 'react';
import { ProjectEndpoints } from '../ProjectEndpoints';
import { DashBorardStructReaderContext } from 'pages/Dashboard/Dashboard';

export const ProjectModules = () => {
  const dashBorardStructReaderContext = useContext(
    DashBorardStructReaderContext
  );

  const projectModulesList: StructModule[] = useMemo(
    () => dashBorardStructReaderContext.structReader.getModules(),
    [dashBorardStructReaderContext.structReader]
  );
  return (
    <Card
      className='flex-2'
      key={'projectModules'}
      title={'Project modules'}
      description={`${dashBorardStructReaderContext.selectedFileName} project modules`}
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
            <ProjectEndpoints selectedModule={module} />
          </Card>
        </Card>
      ))}
    </Card>
  );
};
