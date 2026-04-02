import { createBrowserRouter } from "react-router";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { MainApp } from "./components/MainApp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainApp />,
  },
  {
    path: "/project/:projectId",
    element: <ProjectDetailPage />,
  },
]);