import clsx from "clsx";
import Icon from "../Icon/Icon";

type CommonProps = {
  content: string | JSX.Element;
  icon?: string;
  moddifiers?: string;
};

type ConditionalProps =
  | {
      variant: "success" | "danger" | "warning" | "info";
      color?: never;
    }
  | {
      variant?: never;
      color: string;
    };

type Props = CommonProps & ConditionalProps;

const LabelState: React.FC<Props> = ({
  variant,
  color,
  icon,
  content,
  moddifiers,
}) => {
  return (
    <div
      style={{
        backgroundColor: `color-mix(in srgb,${
          variant ? `var(--${variant})` : color
        } 10%,white)`,
        color: variant ? `var(--${variant})` : color,
        border: `1px solid ${variant ? `var(--${variant})` : color}`,
      }}
      className={clsx("label-state", moddifiers)}
    >
      {icon ? (
        <Icon
          icon={icon}
          size={20}
          weight="bold"
          className={"mr-1"}
          color={`var(--${variant})`}
        />
      ) : null}
      {content}
    </div>
  );
};

export default LabelState;
