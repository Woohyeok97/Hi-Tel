import { Flex } from "./Flex"
import { Text } from "./Text";


export default function Loader() {
  return (
    <Flex direction="column" justify="center" align="center">
      <Text fontSize="lg">Loading..</Text>
      <Flex align="center" gap={12}>
        <Text>대한민국 PC통신</Text>
        <Text>HI-TEL</Text>
      </Flex>
    </Flex>
  );
}
