import { Button } from 'components/Button';
import { MxLink } from 'components/MxLink';
import { logout } from 'helpers';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from 'localConstants';
import { routes } from 'routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { FormatedAddress } from 'components/FormattedAddress';

export const OptionsMenu = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(`${window.location.origin}/unlock`, undefined, false);
  };

  return (
    <>
      {routes
        .filter((element) => element.visibleInHeader)
        .map((routeElement, index) => (
          <MxLink
            className='py-4 lg:py-1 font-bold min-w-fit inline-block px-3 text-center no-underline my-0 mr-0 ml-2 text-main-color hover:bg-main-color/70 hover:text-white hover:rounded-lg'
            key={index}
            to={routeElement.path}
          >
            {routeElement.title}
          </MxLink>
        ))}
      {isLoggedIn ? (
        <div className='py-4 lg:py-0 font-bold flex flex-column lg:inline-block rounded-lg text-center hover:no-underline my-0 text-main-color'>
          <FormatedAddress address={address} />
          <Button
            onClick={handleLogout}
            className='mt-3 lg:mt-0 px-1 hover:bg-main-color/70 hover:text-white hover:rounded-lg'
          >
            <FontAwesomeIcon className='py-3 lg:py-0 text-lg lg:text-sm' icon={faRightFromBracket} />
          </Button>
        </div>
      ) : (
        <MxLink to={RouteNamesEnum.unlock}>Connect</MxLink>
      )}
    </>
  );
};
