import { RouteNamesEnum } from 'localConstants';
import { Disclaimer, Home } from 'pages';
import { Project } from 'pages/Project';
import { Scanner } from 'pages/Scanner';
import { AshSwap } from 'pages/AshSwap';
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
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer',
    component: Disclaimer
  },
  {
    path: RouteNamesEnum.scanner,
    title: 'Scanner',
    component: Scanner
  },
  {
    path: RouteNamesEnum.project,
    title: 'Project',
    component: Project
  },
  {
    path: RouteNamesEnum.AshSwap,
    title: 'Ash swap',
    component: AshSwap
  }
];
