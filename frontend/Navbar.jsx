import { Box, Button, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import AddBookModal from "./AddBookModal"
import ViewLoansModal from "./ViewLoansModal"
import ViewReservationsModal from "./ViewReservationsModal"
import ViewPenaltiesModal from "./ViewPenaltiesModal";
import ViewLoansAndReservationsModal from "./ViewLoansAndReservationsModal";
import ViewAllPenaltiesModal from "./ViewAllPenaltiesModal";
import ViewEntitiesModal from "./ViewEntitiesModal"
import ViewUserDataModal from "./ViewUserDataModal"
import AddUserModal from "./AddUserModal";

const Navbar = ({setBooks, loans, setLoans, reservations, setReservations}) => {
  return <Container maxW={"900px"}>
    <Box px={4} my={4} borderRadius={5} bg={"#282828"}>
      <Flex h="16" alignItems={"center"} justifyContent={"space-between"}>
        <Flex gap={3} alignItems={"center"}>
          <Button>Log in</Button>
          <Button>Sign in</Button>
          <ViewUserDataModal />
          <AddUserModal />
        </Flex>

      </Flex>
    </Box>

    {/*CLIENT CONTROLS */}
    <Box px={4} my={2} borderRadius={5} bg={"#282828"} >
      <Heading>
        <Text align={"center"} color={"white"} fontSize={25}>Client controls:</Text>
      </Heading>
      <Flex h="12" alignItems={"center"} justifyContent={"center"}>
        <ViewLoansAndReservationsModal />
        <ViewPenaltiesModal />
      </Flex>
    </Box>

    {/* EMPLOYEE CONTROLS */}
    <Box px={4} my={2} borderRadius={5} bg={"#282828"}>
                <Heading>
                    <Text align={"center"} color={"white"} fontSize={25}>
                        Employee controls:
                    </Text>
                </Heading>
                <Stack spacing={4}>
                    {/* 1st row of buttons*/}
                    <Flex h="12" alignItems={"center"} justifyContent={"center"} gap={3}>
                        <ViewReservationsModal
                            reservations={reservations}
                            setReservations={setReservations}
                        />
                        <ViewLoansModal loans={loans} setLoans={setLoans} />
                        <AddBookModal setBooks={setBooks} />
                        <ViewAllPenaltiesModal />
                    </Flex>

                    {/* 2nd row of buttons */}
                    <Flex h="8" alignItems={"center"} justifyContent={"center"} gap={3}>
                      <ViewEntitiesModal />
                    </Flex>
                </Stack>
            </Box>

  
  </Container>
}

export default Navbar