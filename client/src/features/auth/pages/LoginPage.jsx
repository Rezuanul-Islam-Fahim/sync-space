import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthWrapper from '../components/AuthWrapper';
import { Button, Input } from '@/shared/components';
import { loginFields, loginSchema } from '../config/login.config';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = () => {};

  return (
    <AuthWrapper header="Welcome back!" className="sm:w-[500px]">
      <p className="text-sm text-text-info text-center">
        We're so exited to see you again!
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loginFields.map(attr => (
          <Input
            key={attr.name}
            {...register(attr.name)}
            {...attr}
            error={errors[attr.name]}
          />
        ))}

        <div className="mt-1">
          <Link to="" className="text-link text-sm hover:underline">
            Forgot your password?
          </Link>
        </div>

        <Button className="mt-5">Login</Button>

        <div className="mt-2">
          <div className="flex flex-row gap-1">
            <p className="text-sm text-text-info">Need an account?</p>
            <Link to="/register" className="text-link text-sm hover:underline">
              Register
            </Link>
          </div>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
