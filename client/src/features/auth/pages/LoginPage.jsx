import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthWrapper from '../components/AuthWrapper';
import { Button, Input } from '@/shared/components';
import { loginFields, loginSchema } from '../config/login.config';
import UI_TEXT from '../constants/uiText';
import { APP_ROUTES } from '@/shared/config';

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
    <AuthWrapper header={UI_TEXT.login.header} className="sm:w-[500px]">
      <p className="text-sm text-text-info text-center">
        {UI_TEXT.login.subtitle}
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
            {UI_TEXT.login.forgotPassword}
          </Link>
        </div>

        <Button className="mt-5" type="submit">
          {UI_TEXT.login.loginLink}
        </Button>

        <div className="mt-2">
          <div className="flex flex-row gap-1">
            <p className="text-sm text-text-info">
              {UI_TEXT.login.needAccount}
            </p>
            <Link
              to={APP_ROUTES.REGISTER}
              className="text-link text-sm hover:underline"
            >
              {UI_TEXT.login.registerLink}
            </Link>
          </div>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
