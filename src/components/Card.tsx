import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = ({ hover = false, className = '', children, ...props }: CardProps) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg p-6 ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
