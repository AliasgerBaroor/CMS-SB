import { Box } from "@chakra-ui/react"
import { Outlet } from "@remix-run/react"

const ComponentWrapper = () => {
  return (
    <Box border={"30px solid #27272a"} bg="#f0f0f0" minHeight={"100vh"} p={4}>
        <Outlet />
    </Box>
  )
}

export default ComponentWrapper