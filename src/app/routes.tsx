import { createBrowserRouter } from "react-router";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { MainApp } from "./components/MainApp";
import { LandingPage } from "./components/LandingPage";
import { NewPage } from "./components/NewPage";
import { OlySensePage } from "./components/OlySensePage";
import { PolypsDashboard } from "./components/polyps/PolypsDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <NewPage />,
  },
  {
    path: "/cv",
    element: <LandingPage />,
  },
  {
    path: "/canvas",
    element: <MainApp />,
  },
  {
    path: "/olysense",
    element: <OlySensePage />,
  },
  {
    path: "/polyps",
    element: <PolypsDashboard />,
  },
  {
    path: "/project/:projectId",
    element: <ProjectDetailPage />,
  },
]);