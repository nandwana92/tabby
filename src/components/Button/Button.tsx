import * as React from 'react';
import cx from 'classnames';

import styles from './Button.css';

export interface IButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
}

export default class Button extends React.PureComponent<IButtonProps> {
  public render() {
    const { children, onClick, className, disabled = false } = this.props;

    return (
      <button
        disabled={disabled}
        onClick={onClick}
        className={cx(styles['button'], className)}
      >
        {children}
      </button>
    );
  }
}
