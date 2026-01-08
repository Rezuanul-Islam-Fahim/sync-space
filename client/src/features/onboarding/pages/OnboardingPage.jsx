import { Link } from 'react-router';
import { IoMdChatbubbles } from 'react-icons/io';

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
          <Link
            to="/login"
            className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="w-full bg-[#4f545c] hover:bg-[#686d73] text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
