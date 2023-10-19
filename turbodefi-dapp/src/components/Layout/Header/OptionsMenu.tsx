import { Button } from 'components/Button';
import { MxLink } from 'components/MxLink';
import { logout } from 'helpers';
import { useGetAccountInfo, useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from 'localConstants';
import { routes } from 'routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { FormatedAddress } from 'components/FormattedAddress';
import { useLocation } from 'react-router-dom';

export const OptionsMenu = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccountInfo();

  const location = useLocation();
  const cleanLocation = location.pathname.split('/').filter((data) => data)[0];
  console.log(cleanLocation);

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
            className={`py-[1.5rem] lg:py-4 font-bold min-w-fit inline-block px-3 text-center no-underline my-0 mr-0 ml-2 text-main-color ${
              cleanLocation ==
              routeElement.path
                .split(':')[0]
                .split('/')
                .filter((data) => data)[0]
                ? 'bg-main-color text-white rounded-lg'
                : 'hover:bg-main-color/70 hover:text-white hover:rounded-lg'
            }`}
            key={index}
            to={routeElement.path.split(':')[0]}
          >
            {routeElement.title}
          </MxLink>
        ))}
      {isLoggedIn ? (
        <div className='font-bold flex content-center rounded-lg text-center hover:no-underline my-0 text-main-color items-center justify-center ms-2'>
          <FormatedAddress address={address} />
          <Button
            onClick={handleLogout}
            className='px-1 hover:bg-main-color/70 hover:text-white hover:rounded-lg bg-transparent px-2'
            color='main-color'
          >
            <FontAwesomeIcon
              className='py-[1.5rem] lg:py-0 text-lg lg:text-sm'
              icon={faRightFromBracket}
            />
          </Button>
        </div>
      ) : (
        <MxLink to={RouteNamesEnum.unlock}>Connect</MxLink>
      )}
    </>
  );
};
