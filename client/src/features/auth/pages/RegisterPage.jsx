import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import FormCheckbox from "../components/FormCheckbox";
import AuthButton from "../components/AuthButton";

const REGISTER_FIELDS = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "dob", label: "Date of Birth", type: "date", required: true },
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    dob: "",
    agreeToTerms: false,
    newsletter: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newError = {};

    if (formData.password.length < 6) {
      newError.password = "Must be 6 characters long";
    }

    if (!formData.agreeToTerms) {
      newError.agreeToTerms = "You must agree to the Terms & Conditions";
    }

    if (!formData.email) newError.email = "This field is required";
    if (!formData.username) newError.username = "This field is required";
    if (!formData.dob) newError.dob = "This field is required";

    setErrors(newError);

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm(formData) == true) {
      console.log("Form submitted:", formData);
    } else {
      console.log("Form has errors:", errors);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#313338] flex items-center justify-center p-4">
      <div className="bg-[#313338] w-full max-w-[800px] flex rounded-md shadow-2xl overflow-hidden min-h-[500px]">
        {/* Left Side Banner */}
        <div className="hidden md:flex w-[350px] bg-[#2B2D31]">Bleh!</div>

        {/* Right Side: Actual Form */}
        <div className="flex-1 p-8 bg-[#313338]">
          <h2 className="text-2xl font-bold text-center text-[#F2F3F5] mb-6">
            Create an account
          </h2>

          <form onSubmit={handleSubmit}>
            {REGISTER_FIELDS.map((field) => (
              <FormInput
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={handleChange}
              />
            ))}

            <FormCheckbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required={true}
            >
              I agree to Discord's <span className="text-[#00A8FC]">Terms</span>
              .
            </FormCheckbox>

            <FormCheckbox
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
            >
              (Optional) Send me emails with updates.
            </FormCheckbox>

            <AuthButton>Continue</AuthButton>

            <div className="text-sm text-[#949BA4] mt-4">
              <Link to="/login" className="text-[#00A8FC] hover:underline">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
