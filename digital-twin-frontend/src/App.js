import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/rootLayout";
import Landing from "./views/Landing";
import Analytics from "./views/consumerBehavior/Analytics";
import CoreEngine from "./views/consumerBehavior/simulation/core-engine";
import WhatIfEngine from "./views/consumerBehavior/simulation/what-if-engine";

// loader
import { loader as analyticsLoader } from "./views/consumerBehavior/Analytics";
import RecommendationEnine from "./views/consumerBehavior/simulation/recommendation-engine";
import NetworkAnalysis from "./views/network-performance/network-analytics";
import NetworkRootLayout from "./components/networkRootLayout";
import WhatIfEngineNetwork from "./views/network-performance/simulation/what-if-engine";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dt",
    element: <RootLayout />,
    children: [
      {
        // eslint-disable-next-line 
        path: "analytics",
        element: <Analytics />,
        loader: analyticsLoader,
      },
      {
        // eslint-disable-next-line 
        path: "simulation/core-engine",
        element: <CoreEngine />,
      },
      {
        // eslint-disable-next-line 
        path: "simulation/what-if-engine",
        element: <WhatIfEngine />,
      },
      {
        // eslint-disable-next-line 
        path: "simulation/optimization-engine",
        element: <RecommendationEnine />,
      },
    ],
  },
  {
    // eslint-disable-next-line 
    path: "/dt/network",
    element: <NetworkRootLayout />,
    children: [
      {
        path: "analytics",
        element: <NetworkAnalysis />,
      },
      {
        path: "simulation/what-if-engine",
        element: <WhatIfEngineNetwork />,
      },
    ],
  },
]);
// eslint-disable-next-line 

function App() {
  return (
    <>
      // eslint-disable-next-line 
      <RouterProvider router={router} />
    </>
  );
}
// eslint-disable-next-line 
export default App;
