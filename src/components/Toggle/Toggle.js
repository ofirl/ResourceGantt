import React, { Component } from 'react';

import './Toggle.css';

import PropTypes from 'prop-types';

class Toggle extends Component {
    constructor(props) {
        super(props);

        this.toggleCheck = this.toggleCheck.bind(this);
        this.value = this.value.bind(this);

        this.state = {
            checked: props.checked ? props.checked : props.defaultChecked
        }
    }
    static propTypes = {
        /** Default state of the toggle */
        defaultChecked: PropTypes.bool,
        /** Toggler inner text - will override children */
        text: PropTypes.string,
        /** Toggler inner html */
        chidlren: PropTypes.any,
        /** callbakc fired before state change, can return false to prevent state change */
        onBeforeChange: PropTypes.func,
        /** call back fired after state change */
        onChange: PropTypes.func
    }
    static defaultProps = {
        defaultChecked: false
    }

    toggleCheck() {
        let newValue = !this.state.checked;
        let previousValue = this.state.checked;
        let changeAllowed = this.props.onBeforeChange && this.props.onBeforeChange(newValue, previousValue);
        if (changeAllowed === false)
            return;

        this.setState({
            checked: !this.state.checked
        });
        this.props.onChange && this.props.onChange(newValue, previousValue);
    }
    value() {
        return this.state.checked;
    }

    render() {
        let { className, ...others} = this.props;

        return (
            <button type="button" className={`dk-switch ${this.state.checked ? 'dk-switch-checked' : ''} ${className}`} onClick={this.toggleCheck} {...others}>
                <span className="dk-switch-inner">
                    {this.props.text || this.props.children}
                </span>
            </button>
        );
    }
}

export default Toggle;