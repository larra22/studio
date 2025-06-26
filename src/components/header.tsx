import type { SVGProps } from 'react';

const TomatoIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" />
      <path d="M14 2C14 2.82843 13.1046 3.5 12 3.5C10.8954 3.5 10 2.82843 10 2C10 1.17157 10.8954 0.5 12 0.5C13.1046 0.5 14 1.17157 14 2Z" fill="green" />
    </svg>
);


export function Header() {
  return (
    <header className="flex items-center justify-center text-center">
      <TomatoIcon className="w-12 h-12 text-primary" />
      <h1 className="text-5xl font-bold ml-4 font-headline text-primary">
        Tomato Time
      </h1>
    </header>
  );
}
