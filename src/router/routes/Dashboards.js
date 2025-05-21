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
const Dateload = lazy(() => import("../../views/dashboard/dailyUseByNodeId/LoadPop"))
const Login = lazy(() => import('../../views/dashboard/login'))
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
    element: <AppBWrapper />,
  },
  {
    path: "/dashboard/Overall",
    element: <Overall />,
  },
  {
    path: "/dashboard/login",
    element: <Login />,
  },
  {
    path: "/dashboard/Singlevillage",
    element: <SingleVillage />,
  },

];

export default DashboardRoutes;
