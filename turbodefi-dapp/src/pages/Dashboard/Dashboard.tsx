import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { Disclosure } from '@headlessui/react';
import { ActionButtonList, BalancePanel, Card } from 'components';
import { useEffect, useState } from 'react';
import { useGetPendingTransactions } from '@multiversx/sdk-dapp/hooks';
import { useGetTokenUSDPrices, useGetTokensBalanceInfo } from 'hooks';
import { API_URL, environment } from 'config';
import TurbodefiContractService from 'services/TurbodefiContractService';
import StructReader from 'StructReader/StructReader';
import { ProjectEndpointForm } from 'pages/Project/ProjectInfo';
import { UsdValueContainer, UsdValueProvider } from 'services';
import BigNumber from 'bignumber.js';

const turbodefiContractService = new TurbodefiContractService(API_URL);

export const Dashboard = () => {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [totalUsdValue, setTotalUsdValue] = useState<BigNumber>(
    new BigNumber(0)
  );

  const { hasPendingTransactions } = useGetPendingTransactions();
  const tokensBalance = useGetTokensBalanceInfo();
  const tokensPrice = useGetTokenUSDPrices();

  const loadStructReader = async (project: string) => {
    const newStructReader = new StructReader(
      '/projects/' + environment + '/' + project
    );
    await newStructReader.load();
    return newStructReader;
  };

  const loadProjects = async () => {
    const endpointsIds = [1, 4, 11, 13, 15, 17, 19, 21, 27, 28, 23];
    const endpointsList = [];
    const structReaders: { [key: string]: StructReader } = {};
    for (let i = 0; i < endpointsIds.length; i++) {
      const endpoint = await turbodefiContractService.getEndpointById(
        endpointsIds[i]
      );
      if (endpoint.project) {
        const structReader = structReaders[endpoint.project]
          ? structReaders[endpoint.project]
          : await loadStructReader(endpoint.project);
        endpointsList.push({ endpoint, structReader });
        structReaders[endpoint.project] = structReader;
      }
    }
    console.log(endpointsList);
    setEndpoints(endpointsList);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (Object.keys(tokensBalance.tokensBalance).length === 0) return;
    tokensPrice.loadPrices(Object.keys(tokensBalance.tokensBalance));
  }, [hasPendingTransactions, tokensBalance.tokensBalance]);

  return (
    <UsdValueProvider>
      <div className='flex flex-col gap-6 max-w-7xl w-full'>
        <div className='flex flex-col rounded-xl bg-white py-6 px-[4%] md:px-6 flex-2'>
          <Card
            className='flex-2 w-full position-relative'
            title='My Dashboard'
            subtitle={<UsdValueContainer totalUpdater={setTotalUsdValue} />}
          >
            <Disclosure defaultOpen={true}>
              {({ open }) => (
                <>
                  <ActionButtonList className='top-[0.3%] sm:top-[10px] right-[0.5%]'>
                    <Disclosure.Button
                      className={`bg-transparent inline-block rounded-lg px-[1rem] py-2 text-center hover:no-underline my-0 text-main-color hover:bg-main-color/80 hover:text-white mr-0 disabled:bg-main-color/20 disabled:text-black disabled:cursor-not-allowed`}
                    >
                      <FontAwesomeIcon
                        icon={open ? faChevronUp : faChevronDown}
                      />
                    </Disclosure.Button>
                  </ActionButtonList>
                  <Disclosure.Panel className=''>
                    <BalancePanel />
                    <div className='grid md:gap-5 gap-[0.5rem] grid-cols-1 sm:grid-cols-2 auto-rows-min mt-3'>
                      {/* TODO LOAD HERE ALL USER PANELS IN DASHBOARD */}
                      {endpoints.map((endpoint, index) => (
                        <div className='w-full border rounded-lg' key={index}>
                          <ProjectEndpointForm
                            module={endpoint.structReader.getModule(
                              endpoint.endpoint.module || ''
                            )}
                            endpoint={endpoint.structReader.getModuleEndpoint(
                              endpoint.endpoint.module || '',
                              endpoint.endpoint.endpoint || ''
                            )}
                            structReader={endpoint.structReader}
                            key={`endpoint_${index}`}
                            fullTitle={true}
                          />
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Card>
        </div>
      </div>
    </UsdValueProvider>
  );
};
