import React, { useEffect } from "react"
import { Flex, Stack, Text } from "@chakra-ui/react"
import CopyCard from "./CopyCard.jsx"
import { BASE_URL } from "../App.jsx"

const CopyStack = ({book, copies, setCopies, loans, setLoans}) => {
		useEffect(() => {
			const getCopies = async () => {
				try {
					const res = await fetch(BASE_URL + "/ksiazki/" + book.id_ksiazki + "/egzemplarze")
					const data = await res.json()
					if(!res.ok) {
						throw new Error(data.error)
					}
					setCopies(data)
				} catch (error) {
					console.error(error)
				}
			}
			getCopies()
		},[setCopies])
	
	return (
    <>
		<Stack gap="2">
			{copies.map((copy) => (
				<CopyCard key={copy.id_egzemplarza} copy={copy} book={book} setCopies={setCopies} loans={loans} setLoans={setLoans}/>
			))}
		</Stack>

		{copies.length === 0 && (
			<Flex justifyContent={"center"}>
				<Text as={"span"} fontSize={"2xl"} color={"white"} mr={2}>
					No copies found.
				</Text>
			</Flex>
		)}
    </>
	)
}
export default CopyStack