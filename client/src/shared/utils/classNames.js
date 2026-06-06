import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const classNames = (...inputs) => {
  return twMerge(clsx(inputs));
};

export default classNames;
