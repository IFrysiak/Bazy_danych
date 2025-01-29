import { Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { useState } from "react";


const AddLoan = ({loans, setLoans, copy}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        id_klienta: "",
        id_egzemplarza: copy.id_egzemplarza,
        data_wypozyczenia: "",
        termin_zwrotu: ""
    })

    const handleAddLoan = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Check if stan is "dostepna"
        if (copy.stan !== "dostepna") {
        toast({
            status: "error",
            title: "The copy is not available.",
            description: `Current state: ${copy.stan}`,
            duration: 5000,
            position: "top-center",
        });
        setIsLoading(false)
        return
        }

        if (
            !inputs.id_klienta ||
            !inputs.data_wypozyczenia ||
            !inputs.termin_zwrotu
        ) {
            toast({
                status: "error",
                title: "All fields are required.",
                duration: 2000,
                position: "top-center",
            })
            setIsLoading(false)
            return;
        }

        try {
            const res = await fetch(BASE_URL + "/wypozyczenia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            })
            const data = await res.json()
            if(!res.ok) {
                throw new Error(data.error)
            }
            toast({
                status: "success",
                title: "Copy loaned.",
                duration: 2000,
                position: "top-center",
            })
            onClose()
            setLoans((prevLoans) => [...prevLoans, data])
        } catch (error) {
            toast({
                status: "error",
                title: "An error occured.",
                description: error.message,
                duration: 2000,
                position: "top-center",
            })
        } finally {
            setIsLoading(false)
            setInputs({
                id_klienta: "",
                data_wypozyczenia: "",
                termin_zwrotu: ""
            }) //clear inputs
            window.location.reload();
        }
    }

    return (
    <>
        <Button onClick={onOpen} mr={3}
            isDisabled={copy.stan !== "dostepna"}
        >
            Loan
        </Button>
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <form onSubmit={handleAddLoan}>
            <ModalContent bg={"#1E1E1E"}>
                <ModalHeader color={"white"}>Add Loan</ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex alignItems={"center"} gap={4} flexDirection="column">
                            <FormControl>
                                <FormLabel textColor={"white"}>Client Id</FormLabel>
                                <Input placeholder="1" textColor={"white"}
                                    value={inputs.id_klienta}
                                    onChange={(e) => setInputs({...inputs, id_klienta: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Lend date</FormLabel>
                                <Input placeholder="yyyy-mm-dd" textColor={"white"}
                                    value={inputs.data_wypozyczenia}
                                    onChange={(e) => setInputs({...inputs, data_wypozyczenia: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Deadline</FormLabel>
                                <Input placeholder="yyyy-mm-dd" textColor={"white"}
                                    value={inputs.termin_zwrotu}
                                    onChange={(e) => setInputs({...inputs, termin_zwrotu: e.target.value})}
                                />
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" textColor={"white"} mr={3} onClick={onClose} _hover={{bg: "#3A3A3A"}}>Cancel</Button>
                        <Button variant="outline" color="green.500" _hover={{bg: "#3A3A3A"}} type='submit' isLoading={isLoading}>Loan</Button>
                    </ModalFooter>
            </ModalContent>
            </form>
        
        </Modal>
    </>
    )
}
export default AddLoan