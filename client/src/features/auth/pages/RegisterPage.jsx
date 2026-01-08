import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommonInput from '@/shared/components/CommonInput';
import CommonCheckbox from '@/shared/components/CommonCheckbox';
import CommonButton from '@/shared/components/CommonButton';
import REGISTER_FIELDS from '../constants/registerFields';

const RegisterPage = () => {
  const [errors, setErrors] = useState({});

  const validateForm = (e) => {
    const { elements } = e.currentTarget;

    const newError = {};

    if (elements.password.value.length < 6) {
      newError.password = 'Must be 6 characters long';
    }

    if (!elements.agreeToTerms.checked) {
      newError.agreeToTerms = 'You must agree to the Terms & Conditions';
    }

    if (!elements.email.value) newError.email = 'This field is required';
    if (!elements.username.value) newError.username = 'This field is required';
    if (!elements.dob.value) newError.dob = 'This field is required';

    setErrors(newError);

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm(e) == true) {
      console.log('Form submitted');
    } else {
      console.log('Form has errors:', errors);
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
