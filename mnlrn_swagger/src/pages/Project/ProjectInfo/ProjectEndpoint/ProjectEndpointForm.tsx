import StructEndpoint from 'StructReader/StructParts/StructEndpoint';
import StructModule from 'StructReader/StructParts/StructModule';
import {
  Button,
  Card,
  TokenSelector,
  FormatAmount,
  Label,
  OutputContainer
} from 'components';
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DataType } from 'StructReader';
import Executor from 'StructReader/Executor';
import PrettyPrinter from 'StructReader/PrettyPrinter';
import { useGetAccountInfo, useGetTokenInfo } from 'hooks';
import { getNFT } from 'services';
import StructReader from 'StructReader/StructReader';
import { formatAmount } from '@multiversx/sdk-dapp/utils/operations/formatAmount';

//Wallet in proteo
//erd1kx38h2euvsgm8elhxttluwn4lm9mcua0vuuyv4heqmfa7xgg3smqkr3yaz

//wallet in seed captain
//erd1lwtuygl44xqlydzhmpcczsu2g2r53ptg52d02htn52vryd2zs8nquv0ahq

//wallet for test gnogen
//erd1jl3sunvv58tplcke6y0qg0zrr5tnwpg54ql9ngs8jad89tm2u8hqehey5y

export const ProjectEndpointForm = ({
  module,
  endpoint,
  structReader
}: {
  module: StructModule;
  endpoint: StructEndpoint;
  structReader: StructReader;
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [response, setResponse] = useState<DataType[]>([]);
  const [executeAction, setExecuteAction] = useState(false);
  const [showExecuteBtn, setShowExecuteBtn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { address } = useGetAccountInfo();

  const executeEndpoint = () => {
    const endpointName = endpoint.endpoint != ''? endpoint.endpoint : endpoint.name;
    console.log("Execute: ", endpointName, endpoint);
    setResponse([]);
    setIsLoading(true);
    Executor.exec(
      structReader,
      module.name,
      endpointName || '',
      ...fieldValues
    ).then((output: any) => {
      const newResponse = Object.keys(output).map((field) => output[field]);
      setIsLoading(false);
      setResponse(newResponse);
    });
  };

  const updateValue = useCallback(
    (index: any, value: any) => {
      const newFieldValues = [...fieldValues];
      newFieldValues[index] = value;
      setFieldValues(newFieldValues);
    },
    [fieldValues]
  );

  useEffect(() => {
    if (!executeAction) return;
    //If all field values are filled, let's do the query
    executeEndpoint();
    setExecuteAction(executeAction);
  }, [executeAction]);

  useEffect(() => {
    if (!address) return;
  }, [address]);

  useEffect(() => {
    const initialValues = (endpoint.inputs || []).map((input) => {
      if (input.type == 'Address') return address;
      return '';
    });

    setFieldValues(initialValues);
    if (
      initialValues.filter((data) => data).length === initialValues.length &&
      initialValues.length > 0 && 
      endpoint.readonly
    ) {
      console.log('Exec: ' + endpoint.name);
      setExecuteAction(true);
      setShowExecuteBtn(false);
    }
  }, []);

  return (
    <Card
      className='flex-2 border my-2'
      key={'projectEndpoint_' + endpoint.name}
      title={endpoint.label || endpoint.name}
      description={endpoint.description}
      reference={''}
    >
      <Form className='mb-3'>
        {endpoint.inputs?.map((input: DataType, index) => (
          <Fragment key={index}>
            {fieldValues.filter((data) => !data).length > 0 && (
              <>
                {input.type != 'Address' && (
                  <Form.Group className='mb-1'>
                    <Form.Label>{input.label || input.name}</Form.Label>
                    {input.type == 'TokenIdentifier' ||
                    input.type == 'EgldOrTokenIdentifier' ? (
                      <TokenSelector
                        onChange={(tokenId: string) => {
                          updateValue(index, tokenId);
                        }}
                        placeHolder='Token'
                        defaultValue={input.token || endpoint.token}
                      />
                    ) : (
                      <Form.Control
                        type={PrettyPrinter.getFormInputType(input.type)}
                        placeholder={input.label}
                        value={fieldValues[index] ?? ''}
                        onChange={(e: any) => {
                          updateValue(index, e.target.value);
                        }}
                      />
                    )}
                  </Form.Group>
                )}
              </>
            )}
          </Fragment>
        ))}
        <>
          {showExecuteBtn && (
            <Button disabled={!address} onClick={executeEndpoint}>
              Execute
            </Button>
          )}
        </>
        <br />
        <OutputContainer isLoading={isLoading}>
          {response.length > 0 && (
            <ShowData output={response.slice(0, 1)} endpoint={endpoint} />
          )}
        </OutputContainer>
      </Form>
    </Card>
  );
};

const ShowData = ({
  output,
  endpoint
}: {
  output: any;
  endpoint: StructEndpoint;
}) => {
  //console.log(output);
  const label = (output.label ?? output.name) || '';
  if (Array.isArray(output)) {
    //console.log('Is array');
    return (
      <ShowContainer label={label} output={output}>
        {label != '' && <Label>{label}: </Label>}
        {output.map((element, index) => (
          <ShowData output={element} endpoint={endpoint} key={index} />
        ))}
      </ShowContainer>
    );
  } else if (!output.hasOwnProperty('value')) {
    //console.log('Is a field');
    return <ShowField output={output} endpoint={endpoint} />;
  } else {
    //console.log('Is an object');
    return (
      <ShowContainer label={label} output={output}>
        {label != '' && <Label>{label}: </Label>}
        <ShowData output={output.value} endpoint={endpoint} />
      </ShowContainer>
    );
  }
};

const ShowContainer = ({
  label,
  output,
  children
}: {
  label: string;
  output: any;
  children: any;
}) => {
  return (
    <>
      {label != '' ? (
        <OutputContainer>
          {output.isNFT && <ShowNFT NFTOutputData={output} />}
          {children}
        </OutputContainer>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

const ShowField = ({
  output,
  endpoint
}: {
  output: any;
  endpoint: StructEndpoint;
}) => {
  const tokenInfo = useGetTokenInfo();
  const className = output.constructor.name;

  if (className == 'Object') {
    const fieldList = Object.values(output);
    return (
      <div className={`${output.balance ? 'font-weight-bold' : ''}`}>
        {fieldList.map((newOutput: any, index) => (
          <Fragment key={index}>
            {!newOutput.hidden && (
              <FormatField output={output} field={newOutput} />
            )}
          </Fragment>
        ))}
      </div>
    );
  } else {
    return <FormatField output={output} field={output} />;
  }
};

const FormatField = ({ output, field }: { output: any; field: any }) => {
  const tokenInfo = useGetTokenInfo();
  return (
    <div
      className={`${
        field.balance ? 'font-weight-bold' : ''
      } d-flex align-items-center`}
    >
      {(field?.label || field?.name) && (
        <Label>{field?.label || field?.name}: </Label>
      )}
      {field.balance ? (
        <div>
          {formatAmount({
            input: (field.value ?? field).toFixed(),
            decimals: tokenInfo.get(field?.token || '', 'decimals'),
            digits: 5,
            addCommas: true,
            showLastNonZeroDecimal: false
          })}
        </div>
      ) : (
        <>{(field.value ?? field).toString()}</>
      )}
      {field.token && (
        <>
          {tokenInfo.get(field?.token || '', 'assets').svgUrl ? (
            <OverlayTrigger
              overlay={
                <Tooltip>{tokenInfo.get(field?.token || '', 'ticker')}</Tooltip>
              }
              placement='top'
              delay={150}
            >
              <img
                className='ms-2 max-h-6'
                src={tokenInfo.get(field?.token || '', 'assets').svgUrl}
                alt={tokenInfo.get(field?.token || '', 'ticker')}
              />
            </OverlayTrigger>
          ) : (
            <div className='ms-2 max-h-6'>
              {tokenInfo.get(field?.token || '', 'ticker')}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ShowNFT = ({ NFTOutputData }: { NFTOutputData: any }) => {
  const [NFTData, setNFTData] = useState<any>({});
  const collectionKey = useMemo(
    () =>
      Object.keys(NFTOutputData.value).find(
        (fieldName) => NFTOutputData.value[fieldName]?.isCollection ?? false
      ) || '',
    [NFTOutputData]
  );
  const collection: string = useMemo(
    () => NFTOutputData.value[collectionKey]?.value || '',
    [NFTOutputData]
  );
  const nonceKey = useMemo(
    () =>
      Object.keys(NFTOutputData.value).find(
        (fieldName) => NFTOutputData.value[fieldName]?.isNonce ?? false
      ) || '',
    [NFTOutputData]
  );
  const nonce: number = useMemo(
    () => NFTOutputData.value[nonceKey]?.value || '',
    [NFTOutputData]
  );

  const getNFTData = async () => {
    const NFTData = await getNFT(collection, nonce);
    setNFTData(NFTData);
    return NFTData;
  };

  useEffect(() => {
    getNFTData();
  }, []);

  return (
    <div>
      <Label>Name:</Label> {NFTData?.name}
      {NFTData?.media?.length && (
        <img
          src={NFTData.media[0].thumbnailUrl ?? NFTData.media[0].url}
          alt={NFTData?.metadata?.description}
        />
      )}
    </div>
  );
};
