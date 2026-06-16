import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import REGISTER_FIELDS from '../constants/registerFields';
import registerSchema from '../schemas/registerSchema';
import AuthWrapper from '../components/AuthWrapper';
import { Button, Input, Checkbox } from '@/shared/components';
import {
  registerUser,
  selectNewUser,
  clearAuthError,
} from '../store/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useSelector(selectNewUser);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async data => {
    await dispatch(registerUser(data)).unwrap();

    if (user) {
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
    <AuthWrapper header="Create an account" className="sm:w-[400px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        {REGISTER_FIELDS.map(attr => (
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
          I agree to Sync Space's <span className="text-link">Terms</span>.
        </Checkbox>

        {error && (
          <div className="border border-danger/40 bg-danger/15 text-text-header px-4 py-2 rounded-md mb-5">
            {error}
          </div>
        )}

        <Button disabled={isLoading}>
          {!isLoading ? 'Create Account' : 'Create Account...'}
        </Button>

        <div className="mt-1">
          <Link to="/login" className="text-link text-sm mt-4 hover:underline">
            Already have an account?
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
