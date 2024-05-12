import * as Icons from "@phosphor-icons/react";
import { useMemo } from "react";

const Icon = (props: any) => {
  const Icon: any = useMemo(
    () => Icons[props.icon as keyof typeof Icons] || Icons.Warning,
    [props.icon]
  );

  return <Icon {...props} />;
};

export default Icon;
