import {
  OverlayTrigger,
  Popover,
  PopoverBody,
  PopoverHeader,
} from "react-bootstrap";
import Button from "../Button/Button";
import { ReactNode } from "react";

type Props = {
  onConfirm: () => void;
  message: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
};

const Confirmation: React.FC<Props> = ({
  onConfirm,
  message,
  placement,
  children,
}) => {
  return (
    <OverlayTrigger
      rootClose
      trigger={"click"}
      placement={placement || "auto"}
      overlay={
        <Popover>
          <PopoverHeader>{message}</PopoverHeader>
          <PopoverBody className="d-flex">
            <Button
              modifiers="me-2"
              onClick={() => {
                onConfirm();
                document.body.click();
              }}
            >
              Confirmar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                document.body.click();
              }}
            >
              Cancelar
            </Button>
          </PopoverBody>
        </Popover>
      }
    >
      <div>{children}</div>
    </OverlayTrigger>
  );
};

export default Confirmation;
