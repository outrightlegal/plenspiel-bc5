import React, { useState } from "react";
import styled from "styled-components";

const InputWrapper = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  border: 1px solid #f3f3f3;
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 0 17px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: #95989d;
  outline: none;
  transition: border 0.3s ease-in-out;

  &:focus-within {
    border: 1px solid #926cff;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
`;

const Submit = styled.input`
  width: 100%;
  height: 44px;
  background: ${({ isDisabled }) =>
    isDisabled
      ? "#c4c4c4"
      : "linear-gradient(97.85deg, #926cff 0%, #4b24bb 100%)"};
  border-radius: 15px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 29px;
  color: #ffffff;
  cursor: pointer;
  border: none;
  transition: background 0.5s ease-in-out;

  &:hover {
    background: ${({ isDisabled }) =>
      isDisabled
        ? "#c4c4c4"
        : "linear-gradient(97.85deg, #4b24bb 0%, #926cff 100%)"};
  }
`;

const IconImage = styled.img`
  margin-right: 10px;
`;

const Icon = (name) => {
  if (name === "email") {
    return <IconImage src="/images/mail-icon.svg" />;
  } else if (name === "name") {
    return <IconImage src="/images/user-icon.svg" />;
  } else if (name === "password") {
    return <IconImage src="/images/lock-icon.svg" />;
  }
};

const InputField = ({
  name,
  type,
  placeholder,
  value,
  handleChange,
  disabled,
}) => {
  if (type === "submit") {
    return (
      <Submit
        name={name}
        type={type}
        placeholder={placeholder}
        value={name}
        isDisabled={disabled}
      />
    );
  } else {
    return (
      <InputWrapper>
        {name && Icon(name)}
        <Input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      </InputWrapper>
    );
  }
};

export default InputField;
