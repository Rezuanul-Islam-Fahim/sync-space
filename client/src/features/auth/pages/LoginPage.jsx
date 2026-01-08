import { Link } from 'react-router';

const LoginPage = () => {
  return (
    <>
      <h1>This is login Page</h1>
      <Link to={'/register'}>Register Now</Link>
    </>
  );
};

export default LoginPage;
