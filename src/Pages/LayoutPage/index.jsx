import { Outlet } from "react-router-dom";
import HeaderPage from "../HeaderPage";
import FooterPage from "../FooterPage";

const LayoutPage = () => (
  <div className="h-screen">
    <HeaderPage />
    <Outlet />
    <FooterPage />
  </div>
);

export default LayoutPage;
