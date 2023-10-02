import { RouteNamesEnum } from 'localConstants';
import { Dashboard, Disclaimer, Home } from 'pages';
import { DashboardOld } from 'pages/Dashboard/DashboardOld';
import { Scanner } from 'pages/Scanner';
import { RouteType } from 'types';

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer',
    component: Disclaimer
  },
  {
    path: RouteNamesEnum.dashboardOld,
    title: 'Original Dashboard',
    component: DashboardOld
  },
  {
    path: RouteNamesEnum.scanner,
    title: 'Scanner',
    component: Scanner
  }
];
