import DappLogo from '../../../assets/img/dapp-logo.png';
import { MxLink } from 'components/MxLink';
import { useGetIsLoggedIn } from 'hooks';
import { RouteNamesEnum } from 'localConstants';

export const Logo = () => {
  const isLoggedIn = useGetIsLoggedIn();
  return (
    <MxLink
      className='flex items-center justify-between max-w-[250px]'
      to={isLoggedIn ? RouteNamesEnum.project : RouteNamesEnum.home}
    >
      <img src={DappLogo} className='w-full' />
    </MxLink>
  );
};
