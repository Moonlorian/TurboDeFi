import { Label } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { getNFT } from 'services';

export const ShowEndpointNFT = ({ NFTOutputData }: { NFTOutputData: any }) => {
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
    setNFTData(NFTData.length > 0 ? NFTData[0] : NFTData);
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
