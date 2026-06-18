import { z } from 'zod';
import UI_TEXT from '../constants/uiText';

export const registerFields = [
  {
    name: 'email',
    label: UI_TEXT.register.emailLabel,
    type: 'email',
    required: true,
  },
  {
    name: 'displayName',
    label: UI_TEXT.register.displayNameLabel,
    type: 'text',
  },
  {
    name: 'username',
    label: UI_TEXT.register.usernameLabel,
    type: 'text',
    required: true,
  },
  {
    name: 'password',
    label: UI_TEXT.register.passwordLabel,
    type: 'password',
    required: true,
  },
  {
    name: 'dateOfBirth',
    label: UI_TEXT.register.dateOfBirthLabel,
    type: 'date',
    required: true,
  },
];

const registerSchema = z.object({
  email: z
    .string()
    .nonempty(UI_TEXT.register.emailRequiredWarn)
    .pipe(z.email(UI_TEXT.register.invalidEmailWarn)),

  displayName: z.string().optional(),

  username: z
    .string()
    .nonempty(UI_TEXT.register.usernameRequiredWarn)
    .min(3, { error: UI_TEXT.register.usernameValidationWarn })
    .max(30, { error: UI_TEXT.register.usernameMaxValidationWarn }),

  password: z
    .string()
    .nonempty(UI_TEXT.register.passwordRequiredWarn)
    .min(6, { error: UI_TEXT.register.passwordValidationWarn }),

  dateOfBirth: z
    .string()
    .nonempty(UI_TEXT.register.dateOfBirthRequiredWarn)
    .pipe(z.coerce.date({ error: UI_TEXT.register.invalidDateOfBirthWarn })),

  agreeToTerms: z.literal(true, { error: UI_TEXT.register.agreeToTermsWarn }),
});

export default registerSchema;
