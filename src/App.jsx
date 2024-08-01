import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CalculatePage from "./Pages/Calculate";
import LayoutPage from "./Pages/LayoutPage";
import HomePage from "./Pages/HomePage";

import "./App.css";

const routes = [
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "calculate",
        element: <CalculatePage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
