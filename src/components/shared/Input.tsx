/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { InputHTMLAttributes } from "react";
import { colors } from "styles/colors";
import { Spacing } from "./Spacing";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  label?: string;
}
export function Input({ label, ...props }: InputProps) {
  return (
    <div>
      {label && <label htmlFor={label}>{label}</label>}
      <Spacing size={12} />
      <input {...props} css={inputStyles} id={label} />
    </div>
  );
};

const inputStyles = css`
  width: 100%;
  color: ${colors.white};
  background-color: ${colors.blue100};
  padding: 10px 20px;
  border-radius: 5px;
`