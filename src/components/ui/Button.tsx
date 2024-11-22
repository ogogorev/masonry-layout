import { styled } from "@linaria/react";
import { FC, PropsWithChildren } from "react";

const ButtonStyled = styled.button`
  padding: 0;
  border: none;

  background: none;
  color: #888;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

type ButtonProps = {
  onClick: () => void;
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  children,
}) => {
  return <ButtonStyled onClick={onClick}>{children}</ButtonStyled>;
};
