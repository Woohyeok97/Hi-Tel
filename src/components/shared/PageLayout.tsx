/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface PageLayoutProps {
  children: React.ReactNode;
}
export default function PageLayout({ children }: PageLayoutProps) {
  return <div css={pageLayoutStyles}>{children}</div>;
}

const pageLayoutStyles = css`
  width: 100%;
  height: 100%;
  padding: 0px 20px;
`