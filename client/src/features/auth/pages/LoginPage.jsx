import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { Button, ErrorBox, Input } from '@/shared/components';
import { APP_ROUTES } from '@/shared/config';

import AuthWrapper from '../components/AuthWrapper';
import { loginFields, loginSchema } from '../config/login.config';
import UI_TEXT from '../constants/uiText';
import { clearAuthError, loginUser } from '../store/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async data => {
    const loggedUser = await dispatch(loginUser(data)).unwrap();

    if (loggedUser) {
      toast.success('Login successful');
    }
  };

  useEffect(() => {
    const subscription = watch(() => {
      if (error) dispatch(clearAuthError());
    });

    return () => subscription.unsubscribe();
  }, [watch, error, dispatch]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

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

        <div className="mt-1 mb-2">
          <Link to="" className="text-link text-sm hover:underline">
            {UI_TEXT.login.forgotPassword}
          </Link>
        </div>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Button className="mt-2" type="submit" isLoading={isLoading}>
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
