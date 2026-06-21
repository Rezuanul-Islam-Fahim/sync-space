import { LinkButton } from '@/shared/components';
import { APP_ROUTES } from '@/shared/config';
import { BiSolidErrorCircle } from 'react-icons/bi';
import UI_TEXT from '../constants/uiText';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-main-bg p-4 text-text">
      <div className="w-full max-w-md rounded-2xl border border-input-border bg-content-bg p-8 text-center shadow-2xl shadow-black/5">
        <div className="mb-5 flex justify-center">
          <BiSolidErrorCircle className="h-16 w-16 text-danger" />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-text-muted">
          {UI_TEXT.error.notFound.eyebrow}
        </p>
        <h1 className="mb-3 text-3xl font-bold text-text-header">
          {UI_TEXT.error.notFound.title}
        </h1>
        <p className="mb-8 text-sm leading-6 text-text-info">
          {UI_TEXT.error.notFound.description}
        </p>

        <LinkButton navigate={APP_ROUTES.HOME}>
          {UI_TEXT.error.returnHome}
        </LinkButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
