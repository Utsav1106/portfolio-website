import type { PropsWithChildren } from "react";
import type { IconType } from "react-icons";

import { cn } from "@/utils/helpers";

interface ButtonProps {
  id?: string;
  leftIcon?: IconType;
  rightIcon?: IconType;
  containerClass?: string;
  onClick?: () => void;
}

export const Button = ({
  id,
  children,
  containerClass,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "group relative z-10 flex gap-2 items-center w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black transition hover:opacity-75",
        containerClass
      )}
    >
      {LeftIcon ? <LeftIcon /> : null}

      <p className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        {children}
      </p>

      {RightIcon ? <RightIcon /> : null}
    </button>
  );
};
