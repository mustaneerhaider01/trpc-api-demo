import { Outlet } from "react-router";
import Header from "./Header";

function AppLayout() {
  return (
    <div>
      <Header />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
