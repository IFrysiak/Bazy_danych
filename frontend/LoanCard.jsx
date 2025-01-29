import { Box, Text, Card, CardBody, CardFooter, IconButton, useToast } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { BASE_URL } from "../App.jsx";
import EditLoan from "./EditLoan.jsx";

const LoanCard = ({ loan, setLoans }) => {

	const toast = useToast()
	const handleDeleteLoan = async () => {
		try {
			const res = await fetch(BASE_URL + "/wypozyczenia/" + loan.id_wypozyczenia, {
				method: "DELETE"
			})
			const data = await res.json()
			if(!res.ok) {
				throw new Error(data.error)
			}
			setLoans((prevLoans) => prevLoans.filter((l) => l.id_wypozyczenia !== loan.id_wypozyczenia))
			toast({
				status: "success",
				title: "Loan deleted successfully.",
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
            <Text fontSize={20} color={"#808080"}>
					Client Id: <Text as={"span"} color={"white"}>{loan.id_klienta}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Copy Id: <Text as={"span"} color={"white"}>{loan.id_egzemplarza}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Loan Id: <Text as={"span"} color={"white"}>{loan.id_wypozyczenia}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Loan date: <Text as={"span"} color={"white"}>{loan.data_wypozyczenia}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Deadline: <Text as={"span"} color={"white"}>{loan.termin_zwrotu}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Return date: <Text as={"span"} color={"white"}>{loan.data_faktycznego_zwrotu}</Text>
				</Text>
			</Box>
        </CardBody>
    	<CardFooter justifyContent="flex-end">
            <EditLoan loan={loan} setLoans={setLoans}/>
            <IconButton icon={<BiTrash size={20} />} colorScheme="red" variant="outline" _hover={{bg: "#3A3A3A"}} onClick={handleDeleteLoan}/>
    	</CardFooter>
    </Card>
	);
};
export default LoanCard;