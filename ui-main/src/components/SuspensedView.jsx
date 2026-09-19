import { Suspense } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

const SuspensedView = ({ children }) => {
  TopBarProgress.config({
    barColors: {
      0: "#8B04FF",
      "1.0": "#8B04FF",
    },
    barThickness: 3,
    shadowBlur: 5,
    shadowColor: "#8B04FF",
  });

  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export default SuspensedView;
