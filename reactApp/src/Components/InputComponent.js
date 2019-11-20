import PropTypes from 'prop-types';
import React from 'react';

const InputComponent = ({ inputType, inputName, onInput }) => (
  <label htmlFor={inputName}>
    <input className="input-text" 
      type={inputType} 
      id={inputName} 
      placeholder="&nbsp;" /*placholder is required for CSS to properly focus on input element */ 
      onChange={onInput} />
    <span className="input-name">{inputName}</span>
    <span className="border"></span>
  </label>
);

InputComponent.propTypes = {
  inputType: PropTypes.oneOf(['input', 'password']),
  inputName: PropTypes.string
};

InputComponent.defaultProps = {
  inputType: "input",
};

export default InputComponent;

