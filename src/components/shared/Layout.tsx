/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Header from "./Header";
import PageLayout from "./PageLayout";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div css={layoutStyles}>
      <Header />
      <PageLayout>
        {children}
      </PageLayout>
      <Navbar />
    </div>
  );
}

const layoutStyles = css`
  max-width: 680px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
`;