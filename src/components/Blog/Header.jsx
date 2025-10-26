import { Link, NavLink } from "react-router-dom";
import PostLogo from "../../assets/images/icons8-circled-user-male-skin-type-6-48.png";

// MUI
import { Stack, Button, Typography } from "@mui/material";

export default function Header() {
  const isAuth = true;

  const posts = [
    { id: 1, title: "science", description: "when", author: "ahmed" },
    { id: 2, title: "Technology", description: "when", author: "sera" },
  ];

  return (
    <header className='flex justify-around bg-violet-400 text-white'>
      {posts.map((post, id) => {
        <p key={id}>{post.title}</p>;
      })}

      <Link to={"/"} className='flex items-center gap-2'>
        <img src={PostLogo} alt='PostLogo' />
        <Typography variant='h6' fontWeight='bold'>
          Header
        </Typography>
      </Link>

      <Stack direction='row' spacing={2}>
        {/* <NavLink to='/'>Home</NavLink> */}
        {isAuth ? (
          <>
            <Button
              component={NavLink}
              to='/CreateBlogPage'
              variant='contained'
            >
              CreatePost
            </Button>
            <Button variant='contained'>Logout</Button>
          </>
        ) : (
          <Button variant='contained'>Login using Goggle</Button>
        )}
      </Stack>
    </header>
  );
}
