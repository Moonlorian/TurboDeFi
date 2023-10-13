import { RouteNamesEnum } from 'localConstants';
import { Disclaimer, Home } from 'pages';
import { Project } from 'pages/Project';
import { Scanner } from 'pages/Scanner';
import { Flow } from 'pages/Flow';
import { RouteType } from 'types';
import { AshSwapPage } from 'pages/AshSwap';

interface RouteWithTitleType extends RouteType {
  title: string;
  visibleInHeader:boolean;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home,
    visibleInHeader: false
  },
  {
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer',
    component: Disclaimer,
    visibleInHeader: false
  },
  {
    path: RouteNamesEnum.scanner,
    title: 'Scanner',
    component: Scanner,
    visibleInHeader: true
  },
  {
    path: RouteNamesEnum.project,
    title: 'Project',
    component: Project,
    visibleInHeader: true
  },
  {
    path: RouteNamesEnum.AshSwap,
    title: 'Ash swap',
    component: AshSwapPage,
    visibleInHeader: true
  },
  {
    path: RouteNamesEnum.Flow,
    title: 'Flow',
    component: Flow,
    visibleInHeader: true
  }
];
