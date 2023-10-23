import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./ui/Home";
import Error from "./ui/Error";
// also imported loader from menu and than renamed it in menuLoader( because of other loaders)
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder, {
  action as createOrderAction,
} from "./features/order/CreateOrder";
import Order, { loader as orderLoader } from "./features/order/Order";
import AppLayout from "./ui/AppLayout";
import { action as updateOrderAction } from "./features/order/UpdateOrder";

// it must be like this defined BrowserRouter, to enable fetching and submiting data
const router = createBrowserRouter([
  {
    // i have sett to AppLayout be the parrent route of all elements, it does not have path because it will serve only for layout of the app
    element: <AppLayout />,
    // if error occurs in child elements(routes) the error will buble up to parent element (unless is it handled in that child element), and we will show it in this errorElement (here <Error/> component), and in that component with help of useRouteError , the error will be shown
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        // also I have set here errorElement , because if it buble up to parent it will go out my layout component and I not going to see layout only error element component
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        // with action property I have connected, action function and Form in CreateOrder file
        action: createOrderAction,
      },
      {
        path: "/order/:orderID",
        element: <Order />,
        loader: orderLoader,
        // also I have set here errorElement , because if it buble up to parent it will go out my layout component and I not going to see layout only error element component
        errorElement: <Error />,
        action: updateOrderAction,
      },

      // we dont need path for page not found like in older version of router-dom
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
