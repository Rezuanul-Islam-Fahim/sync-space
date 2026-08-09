import { IoMdChatbubbles } from 'react-icons/io';

import { LinkButton } from '@/shared/components';
import { APP_ROUTES } from '@/shared/config';

import UI_TEXT from '../constants/uiText';

const HomePage = () => {
  return (
    <div className="max-w-md w-full text-center space-y-8">
      <div className="flex justify-center">
        <IoMdChatbubbles className="text-primary" size="5rem" />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-text-header">
          {UI_TEXT.title}
        </h1>
        <p className="text-text-info text-lg">{UI_TEXT.description}</p>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <LinkButton navigate={APP_ROUTES.LOGIN}>
          {UI_TEXT.loginButton}
        </LinkButton>
        <LinkButton navigate={APP_ROUTES.REGISTER} secondary={true}>
          {UI_TEXT.registerButton}
        </LinkButton>
      </div>
    </div>
  );
};

export default HomePage;
