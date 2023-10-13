import { Button } from 'components/Button';
import { MxLink } from 'components/MxLink';
import { environment } from 'config';
import { logout } from 'helpers';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from 'localConstants';
import DappLogo from '../../../assets/img/dapp-logo.png';
import { routes } from 'routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { FormatedAddress } from 'components/FormattedAddress';

export const Header = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    sessionStorage.clear();
    logout(`${window.location.origin}/unlock`, undefined, false);
  };

  return (
    <header className='flex flex-row align-center justify-center pl-6 pr-6 pt-6 items-center'>
      <div className='max-w-7xl w-full d-flex justify-between items-center'>
        <div className='flex items-baseline'>
          <MxLink
            className='flex items-center justify-between'
            to={isLoggedIn ? RouteNamesEnum.project : RouteNamesEnum.home}
          >
            <img src={DappLogo} />
          </MxLink>
          <div className='text-sm flex gap-1 items-center'>
            <p className='m-0 text-gray-600'>({environment})</p>
          </div>
        </div>
        <nav className='h-full w-full text-sm sm:relative sm:left-auto sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent'>
          <div className='flex no-wrap items-center'>
            {routes
              .filter((element) => element.visibleInHeader)
              .map((routeElement, index) => (
                <MxLink
                  className='py-1 font-bold min-w-fit inline-block px-3 text-center no-underline my-0 mr-0 ml-2 text-main-color hover:bg-main-color/70 hover:text-white hover:rounded-lg'
                  key={index}
                  to={routeElement.path}
                >
                  {routeElement.title}
                </MxLink>
              ))}
            {isLoggedIn ? (
              <div className='font-bold inline-block rounded-lg text-center hover:no-underline my-0 text-main-color'>
                <FormatedAddress address={address} />
                <Button
                  onClick={handleLogout}
                  className='px-1 hover:bg-main-color/70 hover:text-white hover:rounded-lg'
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </Button>
              </div>
            ) : (
              <MxLink to={RouteNamesEnum.unlock}>Connect</MxLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
