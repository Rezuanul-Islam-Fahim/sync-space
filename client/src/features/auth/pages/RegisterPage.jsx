import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import CommonInput from '@/shared/components/CommonInput';
import CommonCheckbox from '@/shared/components/CommonCheckbox';
import CommonButton from '@/shared/components/CommonButton';
import REGISTER_FIELDS from '../constants/registerFields';
import registerSchema from '../schemas/registerSchema';
import AuthWrapper from '../components/AuthWrapper';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AuthWrapper header="Create an account" className="sm:w-[400px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        {REGISTER_FIELDS.map(attr => (
          <CommonInput
            key={attr.name}
            {...register(attr.name)}
            {...attr}
            error={errors[attr.name]}
          />
        ))}

        <CommonCheckbox
          {...register('agreeToTerms')}
          error={errors.agreeToTerms}
          className="mt-4 mb-5"
        >
          I agree to Discord Clone's{' '}
          <span className="text-discord-link">Terms</span>.
        </CommonCheckbox>

        <CommonButton>Create Account</CommonButton>

        <div className="mt-1">
          <Link
            to="/login"
            className="text-discord-link text-sm mt-4 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default RegisterPage;
