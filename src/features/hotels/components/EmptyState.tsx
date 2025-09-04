import { Box, Text } from "@chakra-ui/react";
export default function EmptyState({ text = "No hotels found." }) {
  return <Box p={8}><Text>{text}</Text></Box>;
}
