import { Divider } from "./Divider";
import { Spacing } from "./Spacing";
import { Text } from "./Text";

interface PageTopProps {
  children: React.ReactNode;
  isDivider?: boolean;
}
export function PageTop({ children, isDivider }: PageTopProps) {
  return (
    <>
      <Text fontSize="xl">{children}</Text>
      <Spacing size={20} />
      {isDivider && (
        <>
          <Divider size={2} color="white" />
          <Spacing size={20} />
        </>
      )}
    </>
  );
}