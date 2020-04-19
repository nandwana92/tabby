import * as React from 'react';

import styles from './ToggleSwitch.css';

export interface IToggleSwitchProps {
  initialValue?: boolean;
  label?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export interface IToggleSwitchState {
  checked: boolean;
}

export default class ToggleSwitch extends React.Component<
  IToggleSwitchProps,
  IToggleSwitchState
> {
  constructor(props: IToggleSwitchProps) {
    super(props);

    this.state = {
      checked: !!props.initialValue,
    };
  }

  handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState(
      {
        checked: (e.target as HTMLInputElement).checked,
      },
      () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.checked);
        }
      }
    );
  };

  public render() {
    const { label, className } = this.props;
    return (
      <div className={className}>
        <label className={styles['label']}>
          <div className={styles['toggle']}>
            <input
              className={styles['toggle-state']}
              type="checkbox"
              name="check"
              onChange={this.handleChange}
              checked={this.state.checked}
            />
            <div className={styles['indicator']}></div>
          </div>
          {label ? <div className={styles['label-text']}>{label}</div> : null}
        </label>
      </div>
    );
  }
}
