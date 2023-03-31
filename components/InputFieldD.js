import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: ${({ fullWidth }) => (fullWidth ? "100%" : "324px")};
  width: 90%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 27px;
  color: #0d2447;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 38px;
  background: #fbfbfb;
  border: 1px solid #cacaca;
  border-radius: 6px;
  padding: 0 20px;
  outline: none;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #858585;
  transition: border 0.3s ease-in-out;

  &:focus {
    border: 1px solid #8053ff;
  }
`;

const InputFieldD = ({
  name,
  label,
  type,
  fullWidth,
  placeholder,
  onChange,
}) => {
  return (
    <Wrapper>
      <Label htmlFor={name}>{label}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        id={label}
        fullWidth={fullWidth}
        onChange={onChange}
      />
    </Wrapper>
  );
};

export default InputFieldD;
