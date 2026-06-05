import { IoMdChatbubbles } from 'react-icons/io';
import CommonButton from '@/shared/components/CommonButton';
import MainWrapper from '@/shared/components/MainWrapper';

const OnboardingPage = () => {
    return (
        <MainWrapper>
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <IoMdChatbubbles className="text-primary" size="5rem" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Welcome to Sync Space
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Connect, share, and build communities with millions of
                        people worldwide. Experience seamless conversations, vibrant
                        groups, and endless possibilities.
                    </p>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                    <CommonButton navigate={'/login'}>Log In</CommonButton>
                    <CommonButton navigate={'/register'} secondary={true}>
                        Register
                    </CommonButton>
                </div>
            </div>
        </MainWrapper>
    );
};

export default OnboardingPage;
