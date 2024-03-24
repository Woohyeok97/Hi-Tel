/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { TextareaHTMLAttributes } from "react";
import { colors } from "styles/colors";

interface TextFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{
  label?: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <>
      {label && <label htmlFor={label}>{label}</label>}
      <textarea css={textFieldStyles} id={label} spellCheck={false} {...props} />
    </>
  );
};

const textFieldStyles = css`
  width: 100%;
  color: ${colors.white};
  background-color: ${colors.blue100};
  padding: 10px 20px;
  border-radius: 5px;
  min-height: 200px;
`;