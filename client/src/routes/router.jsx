import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../components/Home";

function Root() {
  return (
    <div>
      <h1>Hello World</h1>

      {/* Testing Purpose */}
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [{ index: true, Component: Home }],
  },
]);

