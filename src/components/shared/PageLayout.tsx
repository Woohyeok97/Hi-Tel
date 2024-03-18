/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface PageLayoutProps {
  children: React.ReactNode;
}
export function PageLayout({ children }: PageLayoutProps) {
  return <div css={pageLayoutStyles}>{children}</div>;
};

const pageLayoutStyles = css`
  width: 100%;
  min-height: 100vh;
  padding: 0px 20px;
`;