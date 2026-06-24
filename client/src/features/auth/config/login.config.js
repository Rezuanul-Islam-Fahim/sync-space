import { z } from 'zod';

import UI_TEXT from '../constants/uiText';

export const loginFields = [
  {
    name: 'email',
    label: UI_TEXT.login.emailLabel,
    type: 'email',
    required: true,
  },
  {
    name: 'password',
    label: UI_TEXT.login.passwordLabel,
    type: 'password',
    required: true,
  },
];

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty(UI_TEXT.login.emailRequiredWarn)
    .pipe(z.email(UI_TEXT.login.invalidEmailWarn)),

  password: z
    .string()
    .nonempty(UI_TEXT.login.passwordRequiredWarn)
    .min(6, { error: UI_TEXT.login.passwordValidationWarn }),
});
