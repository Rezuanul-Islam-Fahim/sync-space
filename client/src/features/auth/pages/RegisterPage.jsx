import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommonInput from '@/shared/components/CommonInput';
import CommonCheckbox from '@/shared/components/CommonCheckbox';
import CommonButton from '@/shared/components/CommonButton';
import REGISTER_FIELDS from '../constants/registerFields';
import registerSchema from '../schemas/registerSchema';

const RegisterPage = () => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const { elements } = e.currentTarget;

    const result = registerSchema.safeParse({
      email: elements.email.value,
      displayName: elements.displayName.value,
      username: elements.username.value,
      password: elements.password.value,
      dob: elements.dob.value,
      agreeToTerms: elements.agreeToTerms.checked,
    });

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();

      const errors = Object.fromEntries(
        Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])
      );

      setErrors(errors);
    } else {
      setErrors({});
      console.log('Form submitted successfully');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#2f3136] flex items-center justify-center p-8">
      <div className="p-8 bg-[#383a40] rounded-lg w-[400px] shadow-2xs">
        <h2 className="text-2xl font-bold text-center text-[#F2F3F5] mb-6">
          Create an account
        </h2>

        <form onSubmit={handleSubmit}>
          {REGISTER_FIELDS.map((field) => (
            <CommonInput
              key={field.name}
              {...field}
              error={errors[field.name]}
            />
          ))}

          <div className="mb-6">
            <CommonCheckbox name="agreeToTerms">
              I agree to Discord Clone's{' '}
              <span className="text-[#00A8FC]">Terms</span>.
            </CommonCheckbox>

            {errors.agreeToTerms && (
              <span className="text-xs text-[#F23F42] italic font-medium">
                {errors.agreeToTerms}
              </span>
            )}
          </div>

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
