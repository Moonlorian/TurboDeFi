import StructModule from 'StructReader/StructParts/StructModule';
import { ActionButton, ActionButtonList, Button, Card } from 'components';
import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from '../ProjectEndpoint/ProjectEndpointForm';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { UsdValueContainer, UsdValueProvider } from 'services';
import BigNumber from 'bignumber.js';
import { usePriceUpdater } from 'hooks';
import { useLocation } from 'react-router-dom';

export const ProjectModule = ({
  module,
  structReader
}: {
  module: StructModule;
  structReader: StructReader;
}) => {
  const [totalUsdValue, setTotalUsdValue] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const toggle = () => {
    setOpen(!open);
  };

  const { updatePrice } = usePriceUpdater();

  useEffect(() => {
    updatePrice(totalUsdValue);
  }, [totalUsdValue]);

  useEffect(() => {
    if (location.hash != '') {
      const endpointHash = location.hash.replace('#', '');

      if (module.name == endpointHash) {
        setOpen(true);
      } else {
        module.groups.map((group) => {
          if (
            module
              .getGroupEndpoints(group.name)
              .filter((endpoint) => endpoint.name == endpointHash).length > 0
          ) {
            setOpen(true);
          }
        });
        if (
          module.endpoints.filter(
            (endpoint) => !endpoint.group && endpoint.name == endpointHash
          ).length > 0
        ) {
          setOpen(true);
        }
      }
    }
  }, []);

  return (
    <UsdValueProvider>
      <Card
        className='flex-2 relative bg-bg-color'
        key={'projectModule_' + module.name}
        title={module.label || module.name}
        description={module.description}
        reference={''}
        subtitle={<UsdValueContainer totalUpdater={setTotalUsdValue} />}
      >
        <ActionButtonList>
          <ActionButton
            action={toggle}
            className={`bg-transparent inline-block rounded-lg px-[1rem] py-2 text-center hover:no-underline my-0 hover:bg-main-color/80 hover:text-white mr-0 disabled:bg-main-color/20 disabled:text-black disabled:cursor-not-allowed`}
            color='main-color'
          >
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          </ActionButton>
        </ActionButtonList>

        <div
          className={`transition-all overflow-hidden ${
            open ? 'max-h-[1024px]' : 'max-h-0'
          }`}
        >
          <div className='grid md:gap-5 gap-[0.5rem] grid-cols-1 sm:grid-cols-2 auto-rows-min'>
            {module.groups.map((group, index) => (
              <div className='w-full border rounded-lg' key={index}>
                {module.getGroupEndpoints(group.name).map((endpoint, index) => (
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
        </div>
      </Card>
    </UsdValueProvider>
  );
};
