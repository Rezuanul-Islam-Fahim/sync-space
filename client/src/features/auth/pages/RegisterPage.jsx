import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import AuthWrapper from '../components/AuthWrapper';
import { Button, Input, Checkbox } from '@/shared/components';
import {
  registerUser,
  selectNewUser,
  clearAuthError,
} from '../store/authSlice';
import registerSchema, { registerFields } from '../config/register.config';
import UI_TEXT from '../constants/uiText';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(selectNewUser);
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

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  useEffect(() => {
    const subscription = watch(() => {
      if (error) dispatch(clearAuthError());
    });

    return () => subscription.unsubscribe();
  }, [watch, error, dispatch]);

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

        {error && (
          <div className="border border-danger/40 bg-danger/15 text-text-header px-4 py-2 rounded-md mb-5">
            {error}
          </div>
        )}

        <Button disabled={isLoading}>
          {!isLoading ? UI_TEXT.register.submit : UI_TEXT.register.submitting}
        </Button>

        <div className="mt-1">
          <Link to="/login" className="text-link text-sm mt-4 hover:underline">
            {UI_TEXT.register.hasAccount}
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
