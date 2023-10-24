import { RouteNamesEnum } from 'localConstants';
import { Disclaimer, Home, StakePage, Flows, Dashboard } from 'pages';
import { Project } from 'pages/Project';
import { Scanner } from 'pages/Scanner';
import { Flow } from 'pages/Flow';
import { RouteType } from 'types';
import { AshSwapPage } from 'pages/AshSwap';

interface RouteWithTitleType extends RouteType {
  title: string;
  visibleInHeader:boolean;
  private:boolean;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Scanner,
    visibleInHeader: false,
    private: false
  },
  {
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer',
    component: Disclaimer,
    visibleInHeader: false,
    private: false
  },
  {
    path: RouteNamesEnum.scanner,
    title: 'Scanner',
    component: Scanner,
    visibleInHeader: true,
    private: false
  },
  {
    path: RouteNamesEnum.project,
    title: 'Projects',
    component: Project,
    visibleInHeader: true,
    private: false
  },
  {
    path: RouteNamesEnum.ashSwap,
    title: 'Swap',
    component: AshSwapPage,
    visibleInHeader: true,
    private: false
  },
  {
    path: RouteNamesEnum.flows,
    title: 'Flows',
    component: Flows,
    visibleInHeader: true,
    private: false
  },
  {
    path: RouteNamesEnum.staking,
    title: 'Staking',
    component: StakePage,
    visibleInHeader: true,
    private: false
  },
  {
    path: RouteNamesEnum.flow,
    title: 'Flow',
    component: Flow,
    visibleInHeader: false,
    private: false
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    visibleInHeader: true,
    private: true
  }
];
