import { Button, Flex, FormControl, FormLabel, Input, Text, useToast, useDisclosure } from "@chakra-ui/react"
import { BiAddToQueue } from "react-icons/bi"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { useState } from "react";
import { BASE_URL } from "../App";

const AddBookModal = ({setBooks}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const[inputs, setInputs] = useState({
        tytul: "",
        autor: "",
        rok_wydania: "",
        kategoria: "",
        id_pracownika: ""
    })
    const toast = useToast()

    const handleAddBook = async (e) => {
        e.preventDefault() //prevent page from reloading
        setIsLoading(true)

        if (
            !inputs.tytul.trim() ||
            !inputs.autor.trim() ||
            !inputs.rok_wydania.trim() ||
            !inputs.kategoria.trim() ||
            !inputs.id_pracownika.trim()
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
            const res = await fetch(BASE_URL + "/ksiazki", {
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
				title: "Book added successfully.",
				duration: 2000,
				position: "top-center",
			});
            onClose()
            setBooks((prevBooks) => [...prevBooks, data]) //showing books after adding new one
        } catch (error) {
            toast({
				status: "error",
				title: "An error occured.",
                description: error.message,
				duration: 2000,
				position: "top-center",
			});
        } finally{
            setIsLoading(false)
            setInputs({
                tytul: "",
                autor: "",
                rok_wydania: "",
                kategoria: "",
                id_pracownika: ""
            }) //clear inputs
            window.location.reload();
        }
    }

    return (
    <>
        <Button onClick={onOpen} variant="outline" color={"green.500"} _hover={{bg: "#3A3A3A"}} mr={3}>
            <BiAddToQueue/>
            Add Book
        </Button>

        <Modal 
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <form onSubmit={handleAddBook}>
            <ModalContent bg={"#1E1E1E"}>
                <ModalHeader textColor={"white"}>
                    <Text fontSize={"30px"} fontWeight={"bold"} letterSpacing={"2px"} textTransform={"uppercase"} textAlign={"center"} color={"white"}>
                        Add Book:
                    </Text >
                </ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex alignItems={"center"} gap={4} flexDirection="column">
                            <FormControl>
                                <FormLabel textColor={"white"}>Title</FormLabel>
                                <Input placeholder="Pan Tadeusz" textColor={"white"}
                                    value={inputs.tytul}
                                    onChange={(e) => setInputs({...inputs, tytul: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Author</FormLabel>
                                <Input placeholder="Adam Mickiewicz" textColor={"white"}
                                    value={inputs.autor}
                                    onChange={(e) => setInputs({...inputs, autor: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Year</FormLabel>
                                <Input placeholder="1834" textColor={"white"}
                                    value={inputs.rok_wydania}
                                    onChange={(e) => setInputs({...inputs, rok_wydania: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Category</FormLabel>
                                <Input placeholder="Poezja epicka" textColor={"white"}
                                    value={inputs.kategoria}
                                    onChange={(e) => setInputs({...inputs, kategoria: e.target.value})}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel textColor={"white"}>Employee ID</FormLabel>
                                <Input placeholder="1" textColor={"white"}
                                    value={inputs.id_pracownika}
                                    onChange={(e) => setInputs({...inputs, id_pracownika: e.target.value})}
                                />
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color={"white"} mr={3} onClick={onClose} _hover={{bg: "#3A3A3A"}}>Cancel</Button>
                        <Button variant="outline" color="green.500" _hover={{bg: "#3A3A3A"}} type="submit" isLoading={isLoading}>Add</Button>
                    </ModalFooter>
            </ModalContent>
            </form>
        </Modal>
    </>
    )
}

export default AddBookModal
