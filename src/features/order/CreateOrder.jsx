import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import store from "../../store";
import Button from "../../ui/Button";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utilities/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";
// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  const navigation = useNavigation();
  const isSubmiting = navigation.state === "submitting";

  const dispatch = useDispatch();

  const formErrors = useActionData();

  // const cart = useSelector(getCart()) in useSelector we dont need to call getCart function
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  //I have set if it is priority order to multiply cart price with 0.2
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* form  is imported from react router dom, action prop is no needed but also work */}
      {/* <Form method="POST" action="/order/new"> */}
      {/* with  form from react router its not needed for state for every input element, no onSubmit handler,not even create loading state, only it is needed to create action function and to connect with route in app.js */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2  sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            // I cannot  place value on this input, because like that it would be controled element and it cant be changed with typing in input, defaultValue is good, because it is only value on beggining and I can change it with typing in input
            defaultValue={username}
            required
            className="input grow"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2  sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input  w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col  gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              defaultValue={address}
              //  input is mine className. I have multiple input fields with same css, so I placed custom className in index.css and name it input
              className="input w-full"
            />
            {address.status === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>
          {/* I wrap this button inside span, because I cannot send more styling to it(button element have 4 different types of styles), so I positioned span with button inside,to the end of input element  */}
          {/* if there is no adress shown to display this buttton element */}
          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px]  z-50 md:right-[5px] md:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type={"small"}
                onClick={(e) => {
                  // because this button is inside form and if is clicked it will submit form , so I must preventDefault behaviour
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get Position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className=" h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400  focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          {/* I submited cart data with this input, alongside with normal inputs(here it is personal data) (cart data is stringified and placed in "hidden" input) */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />

          {/* to disable button when is clicked, with isSubmitting who is derived from useNavigation(), and it is dissabled when there is isLoadingAddress */}
          <Button disabled={isSubmiting || isLoadingAddress} type={"primary"}>
            {isSubmiting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// when form from react router dom is  submited, behind the scenes this action function is called (they must be connected).

export async function action({ request }) {
  const formData = await request.formData();
  // method to convert to object, because I cannot to read data only from fromData
  const data = Object.fromEntries(formData);

  // when I console.log(data), I saw that I need to change little data, I have set from string to be object with parse method, also check type of input to set true or false (it was "on" or "of") so if priority is on it will be true , and when input is not checked it will be false. When I set to that checkbox be controlled input  I have changed this to true
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
    // priority: data.priority === "on",
  };

  // I give  error handling, with isValidPhone function in top of the file, I check is it valid phone, and if it is not valid, to give to errors object key with text, than I check if errors object have length, and if it have I return erors object(with that I show error message)
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you!";

  if (Object.keys(errors).length > 0) return errors;

  // i have send data with createOrder from my custom hook, to post data on api, and that post function return posted data, so here I can use that returned data that was posted with custom hook function
  const newOrder = await createOrder(order);

  //because this is regular function, and it is not component, I cannot call useDispatch function, so I have imported store directly and dispatched clearCart action directly. This should not be used so often because it deactivates redux performance optimization
  store.dispatch(clearCart());

  // I cannot use useNavigate here because it is not in component but this is regular function beneath component,I must use redirect function, because I want to be sended new order page
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
