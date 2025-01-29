import { Container, Stack, Text } from "@chakra-ui/react"
import Navbar from "./mycomponents/Navbar"
import BookStack from "./mycomponents/BookStack"
import { useState } from "react"
export const BASE_URL = "http://localhost:5000/api"

function App() {
  const [books, setBooks] = useState([])
  const [loans, setLoans] = useState([])
  const [reservations, setReservations] = useState([])

  return (
    <Stack minH={"100vh"}  bg={"#0F0F0F"}>
        <Navbar setBooks={setBooks} loans={loans} setLoans={setLoans} reservations={reservations} setReservations={setReservations}/>

        <Container maxW={"1200px"} my={4}>
          <Text fontSize={"30px"} fontWeight={"bold"} letterSpacing={"2px"} textTransform={"uppercase"} textAlign={"center"} color={"white"}>
            Books:
          </Text >
          <BookStack books={books} setBooks={setBooks} loans={loans} setLoans={setLoans} reservations={reservations} setReservations={setReservations}/>
        </Container>
    </Stack>
  )
}

export default App
