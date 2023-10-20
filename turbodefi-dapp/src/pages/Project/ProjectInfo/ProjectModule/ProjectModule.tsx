import StructModule from 'StructReader/StructParts/StructModule';
import { ActionButton, ActionButtonList, Card } from 'components';
import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from '../ProjectEndpoint/ProjectEndpointForm';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { Disclosure } from '@headlessui/react';

export const ProjectModule = ({
  module,
  structReader
}: {
  module: StructModule;
  structReader: StructReader;
}) => {
  return (
    <Card
      className='flex-2 relative'
      key={'projectModule_' + module.name}
      title={module.label || module.name}
      description={module.description}
      reference={''}
    >
      <Disclosure>
        {({ open }) => (
          <>
            <ActionButtonList>
              <Disclosure.Button
                className={`bg-transparent inline-block rounded-lg px-[1rem] py-2 text-center hover:no-underline my-0 text-main-color hover:bg-main-color/80 hover:text-white mr-0 disabled:bg-main-color/20 disabled:text-black disabled:cursor-not-allowed`}
              >
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
              </Disclosure.Button>
            </ActionButtonList>

            <Disclosure.Panel>
              <div className='grid md:gap-5 gap-[0.5rem] grid-cols-1 sm:grid-cols-2 auto-rows-min'>
                {module.groups.map((group, index) => (
                  <div className='w-full border rounded-lg' key={index}>
                    {module
                      .getGroupEndpoints(group.name)
                      .map((endpoint, index) => (
                        <ProjectEndpointForm
                          module={module}
                          endpoint={structReader.getModuleEndpoint(
                            module.name,
                            endpoint.name
                          )}
                          structReader={structReader}
                          key={index}
                          className='w-full'
                        />
                      ))}
                  </div>
                ))}
                {module.endpoints
                  .filter((endpoint) => !endpoint.group)
                  .map((endpoint, index) => (
                    <div className='w-full' key={index}>
                      <ProjectEndpointForm
                        module={module}
                        endpoint={structReader.getModuleEndpoint(
                          module.name,
                          endpoint.name
                        )}
                        structReader={structReader}
                        key={index}
                        className='border h-full'
                      />
                    </div>
                  ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Card>
  );
};
