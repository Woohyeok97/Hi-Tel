import styled from "@emotion/styled";
import { colors } from "styles/colors";

interface UserImageProps {
  size?: number;
}
export const UserImage = styled.div<UserImageProps>(({ size = 40 }) => ({
  width: `${size}px`,
  height: `${size}px`,
  backgroundColor: `${colors['white']}`,
  borderRadius: '100%',
}));