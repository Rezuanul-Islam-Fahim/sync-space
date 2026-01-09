import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import AuthWrapper from '../components/AuthWrapper';
import LOGIN_FIELDS from '../constants/loginFields';
import CommonInput from '@/shared/components/CommonInput';
import CommonButton from '@/shared/components/CommonButton';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted: ', data);
  };

  return (
    <AuthWrapper header="Welcome back!" className="sm:w-[500px]">
      <p className="text-sm text-discord-text-info text-center">
        We're so exited to see you again!
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {LOGIN_FIELDS.map(({ name, ...field }) => (
          <CommonInput
            key={name}
            {...register(name)}
            {...field}
            error={errors[name]}
          />
        ))}

        <div className="mt-1">
          <Link to="" className="text-discord-link text-sm hover:underline">
            Forgot your password?
          </Link>
        </div>

        <CommonButton className="mt-5">Login</CommonButton>

        <div className="mt-2">
          <div className="flex flex-row gap-1">
            <p className="text-sm text-discord-text-info">Need an account?</p>
            <Link
              to="/register"
              className="text-discord-link text-sm hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
