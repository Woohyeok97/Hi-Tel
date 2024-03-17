/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { colors } from "styles/colors";
import Text from './Text';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div css={headerStyles}>
      <Link to="/">
        <Text fontSize="xl">HI-TEL</Text>
      </Link>
    </div>
  );
}

const headerStyles = css`
  position: sticky;
  top: 0;
  text-align: center;
  padding: 8px;
  margin-bottom: 20px;
  background-color: ${colors.blue};
  border-top: 2px solid ${colors.borderBlue};
  border-bottom: 4px solid ${colors.borderBack};
  border-right: 4px solid ${colors.borderBack};
  border-left: 2px solid ${colors.borderBlue};
`;