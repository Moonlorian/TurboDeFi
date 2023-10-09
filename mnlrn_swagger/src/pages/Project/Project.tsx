import { Card } from 'components';
import { ProjectList } from 'localConstants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ProjectInfo } from './ProjectInfo';
import { environment } from 'config';
import StructReader from 'StructReader/StructReader';
import StructModule from 'StructReader/StructParts/StructModule';
import { ProjectModule } from './ProjectInfo';
import { setPriority } from 'os';

export const Project = () => {
  const [structReader, setStructReader] = useState<StructReader>();
  const [projectId, selectProjectId] = useState('');
  const projectList = ProjectList;
  //const projectId: string = path.slice(-1)[0];
  const location = useLocation();

  const selectProject = async (selectedProject: string) => {
    const newStructReader = new StructReader(
      '/projects/' + environment + '/' + selectedProject
    );
    await newStructReader.load();
    return newStructReader;
  };

  useEffect(() => {
    //Todo ==> Load here project, modules, etc.
  }, [structReader]);

  useEffect(() => {
    if (projectId === '') return;
    if (!projectList.includes(projectId)) return;
    selectProject(projectId).then((newStructReader: StructReader) =>
      setStructReader(newStructReader)
    );
  }, [projectId]);

  useEffect(() => {
    const path = location.pathname.replace(/^\/|\/$/g, '').split('/');
    const currentProjectId: string = path.slice(-1)[0];
    if (!projectList.includes(currentProjectId)) {
      console.log('nada');
      selectProjectId('');
    } else {
      selectProjectId(currentProjectId);
    }
  }, [location]);

  //Check if we have a project
  const path = location.pathname.replace(/^\/|\/$/g, '').split('/');
  if (path.length < 2 || projectId == '') return <ProyectSelector />;

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      {structReader?.isLoaded() && (
        <>
          <ProjectInfo project={structReader?.getProject()} />
          {structReader
            ?.getModules()
            .map((module: StructModule, index) => (
              <ProjectModule
                key={index}
                module={module}
                structReader={structReader}
              />
            ))}
        </>
      )}
    </div>
  );
};

export const ProyectSelector = () => {
  const projectList = ProjectList;
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-6 max-w-7xl w-full'>
      <Card
        className='flex-2'
        key={'projectSelector'}
        title={'Select Project'}
        description={'Select project to show all its modules'}
        reference={''}
      >
        <Form.Select
          aria-label='Select project to show'
          onChange={(e: any) => {
            navigate('/project/' + e.target.value);
          }}
        >
          <option value=''>Select project</option>
          {projectList.map((projectId: string, index) => (
            <option key={index} value={projectId}>
              {projectId}
            </option>
          ))}
        </Form.Select>
      </Card>
    </div>
  );
};
