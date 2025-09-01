import { useEffect, useState } from "react";
import "./ProfileModal.css";

// TODO: To create div Modal outside of App component
import { createPortal } from "react-dom";

// TODO: Using AXIOS LIBRARY
import axios from "axios";

// TODO: using REACT ROUTER (External library)
import { Link, useParams } from "react-router-dom";

// TODO: Material UI library
import { Avatar, Stack, Button } from "@mui/material";

// MATERIAL UI ICONS
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

// eslint-disable-next-line react/prop-types
function Model({ isOpen, onCancel }) {
  const [data, setData] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/" + id)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  /* condition to prevent scroll when Modal pop up is active */
  if (isOpen) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {/* background Overlay of Model POP UP */}

      {isOpen &&
        createPortal(
          <div
            className='Overlay'
            onClick={(e) => {
              // condition to click only overLay not actual modal body expect closeBtn
              if (e.target.className === "Overlay") {
                onCancel(false);
              }
            }}
          >
            {/*Model pop up*/}
            <div className='Modal'>
              {/* action button to close model pop up*/}
              <button className='CancelBtn' onClick={() => onCancel(false)}>
                &times;
              </button>

              <Avatar sx={{ m: "auto", bgcolor: "secondary.main" }}>
                <HowToRegIcon />
              </Avatar>
              <h1>Details</h1>

              {/* A line drawn */}
              <div className='line'></div>

              <div className='user_details'>
                <strong>
                  <PersonIcon />
                  Full Name: {data.full_name}
                </strong>

                <strong>
                  <EmailIcon />
                  Email: {data.email}
                </strong>

                <strong>
                  <PersonIcon />
                  Gender: {data.gender}
                </strong>

                <strong>
                  <PhoneIcon />
                  Phone No: {data.phone}
                </strong>
              </div>

              {/* action button Field to close model pop up*/}
              <div className='btn_field'>
                {/* Material UI div*/}
                <Stack direction='row' spacing={6}>
                  {/* closeBtn pop up */}
                  <Button
                    variant='contained'
                    color='error'
                    size='small'
                    endIcon={<KeyboardReturnIcon />}
                    onClick={() => onCancel(false)}
                  >
                    Back
                  </Button>

                  {/* Update CRUD */}
                  {/* React router Link */}
                  <Link to={`/Update/${data.id}`}>
                    <Button
                      variant='contained'
                      color='info'
                      size='small'
                      endIcon={<CheckCircleOutlineIcon />}
                    >
                      Edit/ Update
                    </Button>
                  </Link>
                </Stack>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Model;
