import StructReader from 'StructReader/StructReader';
import { OutputContainer } from 'components';
import { Card } from 'components/Card';
import { createContext, useCallback, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { AuthRedirectWrapper } from 'wrappers';
import { ProjectInfo } from './widgets/ProjectInfo';
import { ProjectModules } from './widgets/ProjectInfo/ProjectModules';
import { ProjectEndpoints } from './widgets/ProjectInfo/ProjectEndpoints';

type DashboardStructType = {
  selectedFileName: string;
  structReader: StructReader;
};

export const DashBorardStructReaderContext = createContext<DashboardStructType>(
  {
    selectedFileName: '',
    structReader: new StructReader('')
  }
);

export const Dashboard = () => {
  const [structReader, setStructReader] = useState<StructReader>(
    new StructReader('')
  );
  const [selectedFileName, setSelectedFileName] = useState('');

  const fileList: string[] = ['proteo', 'seedCaptain', 'gnogen'];

  const selectNewFile = useCallback((event: any) => {
    const fileName = fileList[event.target.value];
    new StructReader('projects/' + fileName).load().then((newStructReader) => {
      setStructReader(newStructReader);
    });
    setSelectedFileName(fileName);
  }, []);

  return (
    <AuthRedirectWrapper>
      <DashBorardStructReaderContext.Provider
        value={{ selectedFileName, structReader }}
      >
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
              onChange={selectNewFile}
            >
              <option value=''>Select project</option>
              {fileList.map((fileName: string, index) => (
                <option key={index} value={index}>
                  {fileName}
                </option>
              ))}
            </Form.Select>
          </Card>
          {structReader.isLoaded() && (
            <>
              <ProjectInfo />
              <ProjectModules />
            </>
          )}
        </div>
      </DashBorardStructReaderContext.Provider>
    </AuthRedirectWrapper>
  );
};
