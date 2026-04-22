import { createBrowserRouter } from "react-router";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { MainApp } from "./components/MainApp";
import { LandingPage } from "./components/LandingPage";

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
    path: "/project/:projectId",
    element: <ProjectDetailPage />,
  },
]);