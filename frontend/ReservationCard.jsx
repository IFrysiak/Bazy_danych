import { Box, Text, Card, CardBody, CardFooter, IconButton, useToast } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { BASE_URL } from "../App.jsx";
import EditReservation from "./EditReservation.jsx";

const ReservationCard = ({ reservation, setReservations }) => {

	const toast = useToast()
	const handleDeleteReservation = async () => {
		try {
			const res = await fetch(BASE_URL + "/rezerwacje/" + reservation.id_rezerwacji, {
				method: "DELETE"
			})
			const data = await res.json()
			if(!res.ok) {
				throw new Error(data.error)
			}
			setReservations((prevReservations) => prevReservations.filter((r) => r.id_rezerwacji !== reservation.id_rezerwacji))
			toast({
				status: "success",
				title: "Reservation deleted successfully.",
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
					Client Id: <Text as={"span"} color={"white"}>{reservation.id_klienta}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Book Id: <Text as={"span"} color={"white"}>{reservation.id_ksiazki}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Reservation Id: <Text as={"span"} color={"white"}>{reservation.id_rezerwacji}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Reservation date: <Text as={"span"} color={"white"}>{reservation.data_rezerwacji}</Text>
				</Text>
			</Box>
			<Box as="ul">
				<Text fontSize={20} color={"#808080"}>
					Deadline: <Text as={"span"} color={"white"}>{reservation.termin_waznosci}</Text>
				</Text>
			</Box>
        </CardBody>
    	<CardFooter justifyContent="flex-end">
            <EditReservation reservation={reservation} setReservations={setReservations}/>
            <IconButton icon={<BiTrash size={20} />} colorScheme="red" variant="outline" _hover={{bg: "#3A3A3A"}} onClick={handleDeleteReservation}/>
    	</CardFooter>
    </Card>
	);
};
export default ReservationCard;