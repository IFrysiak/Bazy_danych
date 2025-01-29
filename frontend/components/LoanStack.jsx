import { Flex, Spinner, Stack, Text} from "@chakra-ui/react"
import LoanCard from "./LoanCard.jsx"
import { useEffect, useState } from "react"
import { BASE_URL } from "../App.jsx"


const LoanStack = ({ loans, setLoans }) => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const getLoans = async () => {
			try {
				const res = await fetch(BASE_URL + "/wypozyczenia")
				const data = await res.json()
				if(!res.ok) {
					throw new Error(data.error)
				}
				setLoans(data)
			} catch (err) {
				console.error(error)
			} finally {
				setIsLoading(false)
			}
		}
		getLoans()
	}, [setLoans])

	return (
		<>
			<Stack gap="2">
				{loans.map((loan) => (
					<LoanCard key={loan.id_wypozyczenia} loan={loan} setLoans={setLoans} />
				))}
			</Stack>

			{isLoading && (
				<Flex justifyContent={"center"}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{!isLoading && loans.length === 0 && (
				<Flex justifyContent={"center"}>
					<Text as={"span"} fontSize={"2xl"} color={"white"} mr={2}>
						No loans found.
					</Text>
				</Flex>
			)}
		</>
	)
}
export default LoanStack