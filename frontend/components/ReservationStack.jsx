import { Flex, Spinner, Stack, Text} from "@chakra-ui/react"
import ReservationCard from "./ReservationCard.jsx"
import { useEffect, useState } from "react"
import { BASE_URL } from "../App.jsx"


const ReservationStack = ({ reservations, setReservations }) => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getReservations = async () => {
			try {
				const res = await fetch(BASE_URL + "/rezerwacje")
				const data = await res.json()
				if(!res.ok) {
					throw new Error(data.error)
				}
				setReservations(data)
			} catch (err) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		}
		getReservations()
	}, [setReservations])

	return (
		<>
			<Stack gap="2">
				{reservations.map((reservation) => (
					<ReservationCard key={reservation.id_rezerwacji} reservation={reservation} setReservations={setReservations} />
				))}
			</Stack>

			{isLoading && (
				<Flex justifyContent={"center"}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{!isLoading && reservations.length === 0 && (
				<Flex justifyContent={"center"}>
					<Text as={"span"} fontSize={"2xl"} color={"white"} mr={2}>
						No reservations found.
					</Text>
				</Flex>
			)}
		</>
	)
}
export default ReservationStack