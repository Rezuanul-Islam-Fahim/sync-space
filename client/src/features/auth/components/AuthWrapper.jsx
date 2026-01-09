import cn from '@/shared/utils/cn';

const AuthWrapper = ({ children, header, className }) => {
  const baseClassName =
    'bg-discord-content-bg rounded-lg w-full p-8 shadow-2xs';

  return (
    <div className={cn(baseClassName, className)}>
      <h2 className="text-2xl font-bold text-center text-discord-text-header mb-4">
        {header}
      </h2>
      {children}
    </div>
  );
};

export default AuthWrapper;
