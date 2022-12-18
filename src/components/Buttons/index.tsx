import React, { useContext } from 'react';

import './index.css';
import { Button } from 'react-bootstrap';
import { ThemeContext } from 'themeContext';

interface ICustomButton {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  customStyle?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const CustomButton: React.FC<ICustomButton> = ({
  children,
  disabled,
  onClick,
  customStyle,
  type
}): JSX.Element => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx.theme;
  return(
    <Button
      className={`${customStyle}-${theme}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </Button>
  )
}

export {
  CustomButton,
};
