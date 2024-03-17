/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { InputHTMLAttributes } from "react";
import { colors } from "styles/colors";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  label?: string;
}
export default function Input({ label, ...props }: InputProps) {
  return (
    <div>
      {label && <label htmlFor={label}>{label}</label>}
      <input {...props} css={inputStyles} id={label} />
    </div>
  );
};

const inputStyles = css`
  width: 100%;
  color: ${colors.white};
  background-color: ${colors.blue100};
  padding: 10px 20px;
  border-radius: 10px;
`