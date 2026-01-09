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
    <div className="min-h-screen w-full bg-[#2f3136] flex items-center justify-center p-8">
      <div className="p-8 bg-[#383a40] rounded-lg w-[400px] shadow-2xs">
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
            <span className="text-[#00A8FC]">Terms</span>.
          </CommonCheckbox>

          <CommonButton>Create Account</CommonButton>

          <div className="text-sm text-[#949BA4] mt-4">
            <Link to="/login" className="text-[#00A8FC] hover:underline">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
