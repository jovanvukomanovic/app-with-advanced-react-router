import { useNavigate, useRouteError } from "react-router-dom";
import LinkButton from "./LinkButton";

function NotFound() {
  const navigate = useNavigate();
  // with useRouteError we sett error message (all kinds of errors, bad Path, bad Url, bad Fetch...)
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      {/* when  error is console.log somethimes show error.data and somethimes error.message */}
      <p>{error.data || error.message}</p>
      <LinkButton to={"-1"}>&larr; Go back</LinkButton>
      {/* <button onClick={() => navigate(-1)}>&larr; Go back</button> */}
    </div>
  );
}

export default NotFound;
