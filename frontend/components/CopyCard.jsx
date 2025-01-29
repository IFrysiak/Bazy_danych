import { Box, Button, Text, Card, CardBody, CardFooter, useToast } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import EditCopy from "./EditCopy";
import AddLoan from "./AddLoan";
import { BASE_URL } from "../App";

const CopyCard = ({ book, copy, setCopies, loans, setLoans }) => {
		const toast = useToast()
		const handleDeleteCopy = async () => {
			try {
				const res = await fetch(BASE_URL + "/egzemplarze/" + copy.id_egzemplarza, {
					method: "DELETE"
				})
				const data = await res.json()
				if(!res.ok) {
					throw new Error(data.error)
				}
				setCopies((prevCopies) => prevCopies.filter((c) => c.id_egzemplarza !== book.id_egzemplarza))
				toast({
					status: "success",
					title: "Copy deleted successfully.",
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
			}	finally{
				window.location.reload();
			}
		}


	return (
	<Card width="1fr" bg={"#1E1E1E"}>
      <CardBody gap="2">
			<Box as="ul">
  				<li>
					<Text fontSize={20} color={"#808080"}>
						Copy Id: <Text as={"span"} color={"white"}>{copy.id_egzemplarza}</Text>
					</Text>
				</li>
				<li>
					<Text fontSize={20} color={"#808080"}>
						Status: <Text as={"span"} color={"white"}>{copy.stan}</Text>
					</Text>
				</li>
			</Box>
    	</CardBody>
    	<CardFooter justifyContent="flex-end">
			<AddLoan loans={loans} setLoans={setLoans} copy={copy} />
			<EditCopy book={book} copy={copy} setCopies={setCopies}/>
			<Button variant="outline" color={"red.500"} _hover={{bg: "#3A3A3A"}} onClick={handleDeleteCopy}><BiTrash size={20}/></Button>
    	</CardFooter>
    </Card>
	);
};
export default CopyCard;