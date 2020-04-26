import * as React from 'react';
import cx from 'classnames';

import styles from './ToggleSwitch.css';

export interface IToggleSwitchProps {
  initialValue?: boolean;
  label?: string;
  className?: string;
  identifier?: string;
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

  componentDidUpdate() {
    const { initialValue } = this.props;
    const { checked } = this.state;

    if (initialValue !== checked) {
      this.setState({
        checked: initialValue,
      });
    }
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
    const { label, className, identifier = 'checkbox' } = this.props;

    return (
      <div className={className}>
        <label className={styles['label']} htmlFor={identifier}>
          <input
            className={cx(styles['toggle-state'], 'mousetrap')}
            type="checkbox"
            name={identifier}
            id={identifier}
            onChange={this.handleChange}
            checked={this.state.checked}
          />
          <div className={styles['toggle-container']}>
            <div className={styles['toggle']}>
              <div className={styles['indicator']}></div>
            </div>
          </div>
          {label ? <div className={styles['label-text']}>{label}</div> : null}
        </label>
      </div>
    );
  }
}
