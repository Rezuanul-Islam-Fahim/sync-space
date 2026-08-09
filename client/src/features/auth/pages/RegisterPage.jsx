import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { Button, Checkbox, ErrorBox, Input } from '@/shared/components';
import { APP_ROUTES } from '@/shared/config';

import AuthWrapper from '../components/AuthWrapper';
import registerSchema, { registerFields } from '../config/register.config';
import UI_TEXT from '../constants/uiText';
import { clearAuthError, registerUser } from '../store/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async data => {
    const { agreeToTerms: _agreeToTerms, ...payload } = data;
    const createdUser = await dispatch(registerUser(payload)).unwrap();

    if (createdUser) {
      toast.success('Account created successfully');
      navigate(APP_ROUTES.LOGIN);
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
    <AuthWrapper header={UI_TEXT.register.header} className="sm:w-[400px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        {registerFields.map(attr => (
          <Input
            key={attr.name}
            {...register(attr.name)}
            {...attr}
            error={errors[attr.name]}
          />
        ))}

        <Checkbox
          {...register('agreeToTerms')}
          error={errors.agreeToTerms}
          className="mt-4 mb-5"
        >
          {UI_TEXT.register.agreeToTermsPrefix}{' '}
          <span className="text-link">{UI_TEXT.register.termsLink}</span>.
        </Checkbox>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Button type="submit" isLoading={isLoading}>
          {UI_TEXT.register.submit}
        </Button>

        <div className="mt-1">
          <Link
            to={APP_ROUTES.LOGIN}
            className="text-link text-sm mt-4 hover:underline"
          >
            {UI_TEXT.register.hasAccount}
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
