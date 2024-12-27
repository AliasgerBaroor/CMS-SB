import { Box, Text } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "nanoFind" },
    { name: "description", content: "Welcome to SB Creations!" },
  ];
};

export default function Index() {
  return (
    <Box>
<Text fontSize={"3xl"}>Welcome to SB Creations!</Text>
    </Box>
  );
}
