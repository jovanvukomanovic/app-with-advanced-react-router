import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useNavigation } from "react-router-dom";
import Loader from "./Loader";

function AppLayout() {
  // with  useNavigation I  have set isLoading property, because always when is started to fetching useNavigation state is iddle or loading
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      {/* loader is shown if isLoading = true, and other components is shown.Before in earlier projects I have set: if is loading to show only Loader component */}
      {/* {true && <Loader />} */}
      {isLoading && <Loader />}
      <Header />
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl ">
          {/* with outlet I render nested route inside another route ,basically Outlet is using inside of parrent to render what is current nested route */}

          <Outlet />
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
