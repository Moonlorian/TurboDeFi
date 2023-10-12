import StructProject from 'StructReader/StructParts/StructProject';
import { Card } from 'components';

export const ProjectInfo = ({
  project
}: {
  project: StructProject;
}) => {

  return (
    <Card
      className='flex-2'
      key={'project_' + project.name}
      title={project.label || project.name}
      description={project.description}
      reference={''}
    >
    </Card>
  );
};
