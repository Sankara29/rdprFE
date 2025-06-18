// ** Icons Import
import { Home, Zap, Circle, Monitor, PieChart, Calendar, UserCheck, CreditCard, Menu, BarChart, DollarSign, User, CheckSquare, Settings, Droplet, Clock, Dribbble, CloudDrizzle, Target, Clipboard, Activity } from 'react-feather'

export default [
  // {
  //   header:"Home pages",
  //   icon: <Menu size={12} />,
  // },



  //Front desk Tab

  {
    id: 'rdprDashboard',
    title: 'Dashboard',
    icon: <Monitor size={12} />,
    navLink: '/dashboard/rdprDashboard'
  },
  // {
  //   id: 'controlPanel',
  //   title: 'Control Panel',
  //   icon: <Settings size={12} />,
  //   navLink: '/dashboard/controlPanel'
  // },
  {
    id: 'Overall',
    title: 'Overall',
    icon: <Settings size={12} />,
    navLink: '/dashboard/overall'
  },
  {
    id: 'live Data',
    title: 'yesterday report',
    icon: <Clock size={12} />,
    navLink: '/dashboard/dailyUse'
  },
  {
    id: 'energymeter',
    title: 'Energy Meter',
    icon: <Zap size={12} />,
    navLink: '/dashboard/energymeter'
  },
  {
    id: 'waterMeter',
    title: 'Water Meter',
    icon: <Droplet size={12} />,
    navLink: '/dashboard/waterMeter'
  },

  {
    id: 'tankNode',
    title: 'Tank Node',
    icon: <Target size={12} />,
    navLink: '/dashboard/tankNode'
  },
  {
    id: 'Report',
    title: 'Billing Report',
    icon: <Activity size={12} />,
    navLink: '/dashboard/BillingReport'
  },
  {
    id: 'Report1',
    title: 'Daily Load Report',
    icon: <Clipboard size={12} />,
    navLink: '/dashboard/DlReport'
  },
  {
    id: 'Report2',
    title: 'Installation Status',
    icon: <Settings size={12} />,
    navLink: '/dashboard/other'
  },
  // {
  //   id: 'controlPanelOnOff',
  //   title: 'ControlPanelOnOff', 
  //   icon: <Circle size={12} />,
  //   navLink: '/dashboard/controlPanelOnOff'
  // },
  // {
  //   id: 'dataInsights',
  //   title: 'DataInsights', 
  //   icon: <Circle size={12} />,
  //   navLink: '/dashboard/dataInsights'
  // },

  // {
  //   id: 'villageDataInsights',
  //   title: 'VillageDataInsights', 
  //   icon: <Circle size={12} />,
  //   navLink: '/dashboard/villageDataInsights'
  // },
  {
    id: 'compare',
    title: 'Comparing',
    icon: <Calendar size={12} />,
    navLink: '/dashboard/comparing'
  },
  {
    id: 'getTime',
    title: 'getTime Details',
    icon: <Circle size={12} />,
    navLink: '/dashboard/gettime'
  },

]