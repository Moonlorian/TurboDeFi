import StructProject from 'StructReader/StructParts/StructProject';
import { ActionButton, ActionButtonList, Card } from 'components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { UsdValueContainer, UsdValueProvider } from 'services';

export const ProjectInfo = ({ project }: { project: StructProject }) => {
  const navigate = useNavigate();
  return (
    <Card
      className='flex-2 relative'
      key={'project_' + project.name}
      title={project.label || project.name}
      description={project.description}
      reference={project.url}
      subtitle={<UsdValueContainer />}
    >
      <ActionButtonList>
        <ActionButton
          action={() => {
            navigate('/project');
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </ActionButton>
      </ActionButtonList>
    </Card>
  );
};
