import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    //fetcher.Form is like any other form, but other form navigate from page (ussualy), but when fetcher.Form is submited data is only revalidated, and shown again. Here when data is already submitted we want to change priority of order, from not priority order to that order have priority
    <fetcher.Form method="Patch" className="text-right">
      {/* here I update only priority, but in other applications I can on similar way (in fetcherForm to place inputs) to update, another informations from order, like name, adress etc.. */}
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderID, data);
  return null;
}

export default UpdateOrder;
