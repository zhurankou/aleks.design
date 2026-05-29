import { createBrowserRouter } from "react-router";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { MainApp } from "./components/MainApp";
import { LandingPage } from "./components/LandingPage";
import { NewPage } from "./components/NewPage";
import { OlySensePage } from "./components/OlySensePage";
import { PolypsDashboard } from "./components/polyps/PolypsDashboard";
import { BaseTest } from "./components/BaseTest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/canvas",
    element: <MainApp />,
  },
  {
    path: "/new",
    element: <NewPage />,
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
    path: "/base-test",
    element: <BaseTest />,
  },
  {
    path: "/project/:projectId",
    element: <ProjectDetailPage />,
  },
]);