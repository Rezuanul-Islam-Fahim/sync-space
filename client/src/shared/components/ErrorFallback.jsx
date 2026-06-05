import CommonButton from "./CommonButton";
import MainWrapper from "./MainWrapper";
import { BiSolidErrorCircle } from "react-icons/bi";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <MainWrapper>
            <div className="max-w-md w-full bg-content-bg rounded-lg p-8 text-center shadow-2xs">
                <div className="flex justify-center mb-5">
                    <BiSolidErrorCircle className="w-16 h-16 text-danger" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
                <p className="text-sm text-gray-900 mb-6 bg-gray-500 p-3 rounded overflow-auto">
                    {error.message}
                </p>
                <CommonButton onClick={resetErrorBoundary}>
                    Try to recover
                </CommonButton>

            </div>
        </MainWrapper>
    );
}

export default ErrorFallback