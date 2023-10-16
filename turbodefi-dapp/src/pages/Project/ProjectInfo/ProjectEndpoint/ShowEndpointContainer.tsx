import { ShowEndpointNFT } from "./ShowEndpointNFT";

export const ShowEndpointContainer = ({
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
          <>
            {output.isNFT && <ShowEndpointNFT NFTOutputData={output} />}
            {children}
          </>
        ) : (
          <>{children}</>
        )}
      </>
    );
  };
  