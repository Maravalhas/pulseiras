import { CircleNotch } from "@phosphor-icons/react";
import { MouseEventHandler, ReactNode } from "react";
import React from "react";
import { clsx } from "../../utilities/helpers";
import Icon from "../Icon/Icon";

type Props = {
  loading?: boolean;
  submit?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: string;
  disabled?: boolean;
  form?: string;
  iconModifiers?: string;
  iconPosition?: "left" | "right";
  modifiers?: string;
  variant?: "primary" | "secondary" | "info" | "danger" | "warning";
  children?: ReactNode;
};

const Button = React.forwardRef<any, Props>(
  (
    {
      loading,
      submit,
      onClick,
      icon,
      disabled,
      form,
      modifiers,
      iconModifiers,
      iconPosition,
      variant,
      children,
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          `btn btn-${variant || "primary"}`,
          modifiers && modifiers
        )}
        type={submit ? "submit" : "button"}
        disabled={loading || disabled}
        onClick={onClick ? onClick : () => {}}
        {...(form ? { form } : {})}
        ref={ref}
      >
        {iconPosition === "right" && children}
        {loading ? (
          <CircleNotch
            className={clsx(
              "spinner",
              children && iconPosition !== "right" && "mr-1",
              children && iconPosition === "right" && "ml-1"
            )}
            size={20}
          />
        ) : (
          <>
            {icon ? (
              <Icon
                icon={icon}
                size={20}
                weight="bold"
                className={clsx(
                  children && iconPosition !== "right" && "mr-1",
                  children && iconPosition === "right" && "ml-1",
                  iconModifiers && iconModifiers
                )}
              />
            ) : null}
          </>
        )}
        {iconPosition !== "right" && children}
      </button>
    );
  }
);

export default Button;
