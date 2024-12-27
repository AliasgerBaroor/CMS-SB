import { Box, HStack, Image, Text } from "@chakra-ui/react";
const Home = () => {
  return (
    <HStack width={"100vh"}>
      <Box width={"50%"}>
        <Text>Landing page</Text>
      </Box>
      <Box width={"50%"}>
      <Image src="/landing_image.jpg" rounded="md" alt="landing-page" />
      </Box>
    </HStack>
  );
}

export default Home