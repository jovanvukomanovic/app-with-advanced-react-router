import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";

import MenuItem from "./MenuItem";

function Menu() {
  // with useLoaderDAta from router dom I have fetched data and setted in menu constant, before that I have imported loader function in app.js setted in route from menu, and when I click on menu route I have automatically fetch data, react router starts to fetch data when it starts to rendering route, with useEffect it is fetch on render, first is component rendered than fetching starts
  const menu = useLoaderData();

  return (
    <ul className="divide-y divide-stone-200 px-2">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

// in this loader function I have returned getMenu function for fetching data (from custom hook file), I have setted loader function in menu file where I get menu data
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
