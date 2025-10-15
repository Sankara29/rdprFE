import { lazy } from "react";


const DashboardRDPRDashboard = lazy(() => import("../../views/dashboard/rdprDashboard"));
const DashboardControlPanel = lazy(() => import("../../views/dashboard/controlPanel"));
const DashboardControlPanelOnOff = lazy(() => import("../../views/dashboard/controlPanelOnOff"));
const DashboardDataInsights = lazy(() => import("../../views/dashboard/dataInsights"));
const DashboardVillageDataInsights = lazy(() => import("../../views/dashboard/villageDataInsights"));
const DashboardEnergyMeter = lazy(() => import("../../views/dashboard/energyMeter"));
const DashboardWaterMeter = lazy(() => import("../../views/dashboard/waterMeter"));
const DashboardLiveData = lazy(() => import("../../views/dashboard/liveData"));
const DashboardDailyUse = lazy(() => import("../../views/dashboard/dailyUse"));
const DashboardDailyUseNodeId = lazy(() => import("../../views/dashboard/dailyUseByNodeId"));
const DashboardLiveDataNodeId = lazy(() => import("../../views/dashboard/liveDataNodeId"));
const DashboardEnergyMeterNodeId = lazy(() => import("../../views/dashboard/energyMeterNodeId"));
const DashboardEnergyMeterNodeIdLive = lazy(() => import("../../views/dashboard/energyMeterNodeIdlive"));
const DashboardEnergyMeterNodeIdBill = lazy(() => import("../../views/dashboard/energyMeterNodeIdBill"));
const DashboardWaterMeterNodeId = lazy(() => import("../../views/dashboard/waterMeterNodeId"));
const DashboardWaterMeterNodeIdLive = lazy(() => import("../../views/dashboard/waterMeterNodeIdlive"));
const DashboardReport = lazy(() => import("../../views/dashboard/reportMeter"));
const DashboardReportNodeId = lazy(() => import("../../views/dashboard/reportDL"));
const Overall = lazy(() => import('../../views/dashboard/OverAll'));
const SingleVillage = lazy(() => import('../../views/dashboard/SingleVillage'));
const DailyInstallationStatus = lazy(() => import('../../views/dashboard/dailyInstallationStatus'));
const GettimeCount = lazy(() => import('../../views/dashboard/gettimeWithCount'));
const Dateload = lazy(() => import("../../views/dashboard/dailyUseByNodeId/LoadPop"))
const Installed = lazy(() => import("../../views/dashboard/installedStats"))
const GetTime = lazy(() => import("../../views/dashboard/GetTime"))
const GetTankNode = lazy(() => import("../../views/dashboard/tankNode"))
const Compare = lazy(() => import('../../views/dashboard/comparingReport'))
const Login = lazy(() => import('../../views/dashboard/login'))
const EnergyMeterHttp = lazy(() => import('../../views/dashboard/energyMeterhttp'));
const EnergyMeterNodeHttp = lazy(() => import('../../views/dashboard/energyMeterNodeIdhttp'));
const WaterMeterNodeHttp = lazy(() => import('../../views/dashboard/httpwaterMeterNodeId'));
const GettimeCountField = lazy(() => import('../../views/dashboard/gettimeWithCountField'));
const Getsession = lazy(() => import('../../views/dashboard/sessionDetails'));
const Newrrno = lazy(() => import('../../views/dashboard/newRRNO'));
import { useEffect, useRef, useState } from "react";
// Inside the iframe script (on the same page as your survey)

const AppBWrapper = () => {
  const iframeRef = useRef(null);


  useEffect(() => {
    // Hide sidebar by adding style to sidebar element
    const sidebar = document.querySelector('.sidebar, #sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }

    // Cleanup: restore sidebar display on unmount
    return () => {
      if (sidebar) {
        sidebar.style.display = '';
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://rdpr-survey-fe-copy.vercel.app/survey`}
      title="App B"
      style={{ border: "none", width: "100%", height: "90vh", marginTop: "auto" }}
    />
  );
};


//Nayana
const DashboardRoutes = [

  {
    path: "/dashboard/rdprDashboard",
    element: <DashboardRDPRDashboard />,
  },
  {
    path: "/dashboard/controlPanel",
    element: <DashboardControlPanel />,
  },
  {
    path: "/dashboard/energymeter",
    element: <DashboardEnergyMeter />,
  },
  {
    path: "/dashboard/watermeter",
    element: <DashboardWaterMeter />,
  },
  {
    path: "/dashboard/liveData",
    element: <DashboardLiveData />,
  },
  {
    path: "/dashboard/dailyUse",
    element: <DashboardDailyUse />,
  },
  {
    path: "/dashboard/dailyUse/nodeId",
    element: <DashboardDailyUseNodeId />,
  },
  {
    path: "/dashboard/dailyUse/nodeId/date",
    element: <Dateload />,
  },
  {
    path: "/dashboard/BillingReport",
    element: <DashboardReport />,
  },
  {
    path: "/dashboard/DlReport",
    element: <DashboardReportNodeId />,
  },
  {
    path: "/dashboard/liveData/nodeId",
    element: <DashboardLiveDataNodeId />,
  },
  {
    path: "/dashboard/energymeter/nodeId",
    element: <DashboardEnergyMeterNodeId />,
  },
  {
    path: "/dashboard/liveData/energyByNodeId",
    element: <DashboardEnergyMeterNodeIdLive />,
  },
  {
    path: "/dashboard/energymeterhttp",
    element: <EnergyMeterHttp />,
  },
  {
    path: "/dashboard/energyByNodeIdhttp",
    element: <EnergyMeterNodeHttp />,
  },
  {
    path: "/dashboard/waterByNodeIdhttp",
    element: <WaterMeterNodeHttp />,
  },
  {
    path: "/dashboard/Dl/energyByNodeId",
    element: <DashboardEnergyMeterNodeIdBill />,
  },
  {
    path: "/dashboard/liveData/waterByNodeId",
    element: <DashboardWaterMeterNodeIdLive />,
  },
  {
    path: "/dashboard/watermeter/nodeId",
    element: <DashboardWaterMeterNodeId />,
  },
  {
    path: "/dashboard/controlPanelOnOff",
    element: <DashboardControlPanelOnOff />,
  },
  {
    path: "/dashboard/dataInsights",
    element: <DashboardDataInsights />,
  },
  {
    path: "/dashboard/villageDataInsights",
    element: <DashboardVillageDataInsights />,
  },
  {
    path: "/dashboard/other",
    // element: <AppBWrapper />,
    element: <Installed />
  },
  {
    path: "/dashboard/Overall",
    element: <Overall />,
  },
  {
    path: "/dashboard/getTime",
    element: <GetTime />,
  },
  {
    path: "/dashboard/tankNode",
    element: <GetTankNode />,
  },
  {
    path: "/dashboard/comparing",
    element: <Compare />
  },
  {
    path: "/dashboard/login",
    element: <Login />,
  },
  {
    path: "/dashboard/Singlevillage",
    element: <SingleVillage />,
  },
  {
    path: "/dashboard/dailyInstallationStatus",
    element: <DailyInstallationStatus />,
  },

  {
    path: "/dashboard/gettimeWithCount",
    element: <GettimeCount />,
  },
  {
    path: "/dashboard/gettimeWithCountField",
    element: <GettimeCountField />,
  }, {
    path: "/dashboard/session",
    element: <Getsession />,
  }, {
    path: "/dashboard/newRRNO",
    element: <Newrrno />,
  },
];

export default DashboardRoutes;
