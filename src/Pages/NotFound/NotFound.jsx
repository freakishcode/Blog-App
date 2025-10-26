// Css
import "./NotFound.css";

// REACT ROUTER LINKS
import { Link /*, useRouteError*/ } from "react-router-dom";

import NotFoundImage from "../../assets/images/page-not-found.jpg";

// MUI
import { Button, Typography } from "@mui/material";

function NotFound() {
  // useRouteError only works if you are using the Data Router API (createBrowserRouter + RouterProvider).
  // const error = useRouteError();

  return (
    <div className='pageNotFound'>
      <Typography variant='h6' fontWeight='bold' color='error'>
        404 / Page Not Found!
      </Typography>

      <img src={NotFoundImage} alt='Page Not Found' />

      <p>
        The Component Page you are looking for does not exits or is not found.
        Please reload the page or check if the URL is correct. if issue keep
        persisting please contact our help page for Assistance, our you can call
        our help service Number +2340000000 or Visit our secondary website for
        more help for what to do?
      </p>

      {/* Home PAGE COMPONENT */}
      <div className='pageNotFoundFooter'>
        <Button component={Link} to='/' variant='contained' color='primary'>
          Go back To HomePage
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
