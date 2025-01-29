import { Box, Text, Card, CardBody, CardFooter, IconButton, useToast } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";

import EditBook from "./EditBook.jsx"
import AddCopy from "./AddCopy.jsx"
import CopyModal from "./CopyModal.jsx"
import { BASE_URL } from "../App.jsx";
import { useState } from "react";

const BookCard = ({ book, setBooks, loans, setLoans, reservations, setReservations }) => {
	const [copies, setCopies] = useState([])

	const toast = useToast()
	const handleDeleteBook = async () => {
		try {
			const res = await fetch(BASE_URL + "/ksiazki/" + book.id_ksiazki, {
				method: "DELETE"
			})
			const data = await res.json()
			if(!res.ok) {
				throw new Error(data.error)
			}
			setBooks((prevBooks) => prevBooks.filter((b) => b.id_ksiazki !== book.id_ksiazki))
			toast({
				status: "success",
				title: "Book deleted successfully.",
				duration: 2000,
				position: "top-center",
			});
		} catch (error) {
			toast({
				status: "error",
				title: "An error occured.",
				description: error.message,
				duration: 2000,
				position: "top-center",
			});
		} finally {
			window.location.reload();
		}
	}
	return (
	<Card width="1fr" bg={"#1E1E1E"}>
        <CardBody>
			<Box as="ul">
				<Text fontSize={30} color={"white"}>{book.tytul}</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Author: <Text as={"span"} color={"white"}>{book.autor}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Year: <Text as={"span"} color={"white"}>{book.rok_wydania}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Category: <Text as={"span"} color={"white"}>{book.kategoria}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Employee id: <Text as={"span"} color={"white"}>{book.id_pracownika}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Number of copies: <Text as={"span"} color={"white"}>{book.liczba_egzemplarzy}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Number of available copies: <Text as={"span"} color={"green.400"}>{book.dostepne_egzemplarze}</Text>
				</Text>
			</Box>
        </CardBody>
    	<CardFooter justifyContent="flex-end">
	  		<CopyModal book={book} copies={copies} setCopies={setCopies} loans={loans} setLoans={setLoans} reservations={reservations} setReservations={setReservations}/>
			<AddCopy setCopies={setCopies} book={book}/>
			<EditBook book={book} setBooks={setBooks}/>
			<IconButton icon={<BiTrash size={20} />} colorScheme="red" variant="outline" _hover={{bg: "#3A3A3A"}} onClick={handleDeleteBook}/>
    	</CardFooter>
    </Card>
	);
};
export default BookCard;