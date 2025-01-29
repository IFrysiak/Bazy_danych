import { Flex, Spinner, Stack, Text} from "@chakra-ui/react"
import BookCard from "./BookCard.jsx"
import { useEffect, useState } from "react"
import { BASE_URL } from "../App.jsx"


const BookStack = ({ books, setBooks, loans, setLoans, reservations, setReservations }) => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getBooks = async () => {
			try {
				const res = await fetch(BASE_URL + "/ksiazki")
				const data = await res.json()
				if(!res.ok) {
					throw new Error(data.error)
				}
				setBooks(data)
			} catch (err) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		}
		getBooks()
	}, [setBooks])

	return (
		<>
			<Stack gap="2">
				{books.map((book) => (
					<BookCard key={book.id_ksiazki} book={book} setBooks={setBooks} loans={loans} setLoans={setLoans} reservations={reservations} setReservations={setReservations}/>
				))}
			</Stack>

			{isLoading && (
				<Flex justifyContent={"center"}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{!isLoading && books.length === 0 && (
				<Flex justifyContent={"center"}>
					<Text as={"span"} fontSize={"2xl"} color={"white"} mr={2}>
						No books found.
					</Text>
				</Flex>
			)}
		</>
	)
}
export default BookStack