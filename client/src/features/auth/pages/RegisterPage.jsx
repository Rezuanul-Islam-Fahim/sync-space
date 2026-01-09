import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import CommonInput from '@/shared/components/CommonInput';
import CommonCheckbox from '@/shared/components/CommonCheckbox';
import CommonButton from '@/shared/components/CommonButton';
import REGISTER_FIELDS from '../constants/registerFields';
import registerSchema from '../schemas/registerSchema';

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
    <div className="min-h-screen w-full bg-discord-main-bg flex items-center justify-center p-8">
      <div className="p-8 bg-discord-content-bg rounded-lg w-[400px] shadow-2xs">
        <h2 className="text-2xl font-bold text-center text-[#F2F3F5] mb-6">
          Create an account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {REGISTER_FIELDS.map(({ name, ...field }) => (
            <CommonInput
              key={name}
              {...register(name)}
              {...field}
              error={errors[name]}
            />
          ))}

          <CommonCheckbox
            {...register('agreeToTerms')}
            error={errors.agreeToTerms}
          >
            I agree to Discord Clone's{' '}
            <span className="text-discord-link">Terms</span>.
          </CommonCheckbox>

          <CommonButton>Create Account</CommonButton>

          <div className="text-sm mt-4">
            <Link to="/login" className="text-discord-link hover:underline">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
