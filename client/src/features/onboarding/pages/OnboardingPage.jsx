import { IoMdChatbubbles } from 'react-icons/io';
import CommonButton from '../../../shared/components/CommonButton';

const OnboardingPage = () => {
  return (
    <div className="min-h-screen bg-[#2f3136] flex flex-col justify-center items-center text-white p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <IoMdChatbubbles color="#5865F2" size="5rem" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to Discord Clone
          </h1>
          <p className="text-gray-400 text-lg">
            Connect, share, and build communities with millions of people
            worldwide. Experience seamless conversations, vibrant groups, and
            endless possibilities.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <CommonButton navigate={'/login'}>Log In</CommonButton>
          <CommonButton navigate={'/register'} secondary={true}>
            Register
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
