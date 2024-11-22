import { RouterProvider } from "react-router-dom";

// import { Sandbox } from "./components/Sandbox/Sandbox";
import { router } from "./router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* <Sandbox /> */}
    </>
  );
}

export default App;
