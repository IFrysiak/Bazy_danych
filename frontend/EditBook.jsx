import React, { useState } from 'react'
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
import { BiEditAlt } from "react-icons/bi";
import { useDisclosure } from "@chakra-ui/react";
import { BASE_URL } from '../App';

function EditBook({book, setBooks}) {
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        tytul: book.tytul,
        autor: book.autor,
        rok_wydania: book.rok_wydania,
        kategoria: book.kategoria,
    })
    const toast = useToast()
    const handleEditBook = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (
            !inputs.tytul.trim() ||
            !inputs.autor.trim() ||
            !inputs.rok_wydania ||
            !inputs.kategoria.trim()
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
            const res = await fetch(BASE_URL + "/ksiazki/" + book.id_ksiazki, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs)
            })
            const data = await res.json()
            if(!res.ok) {
                throw new Error(data.error)
            }
            setBooks((prevBooks) => prevBooks.map((b) => b.id_ksiazki === book.id_ksiazki ? data : b))
            toast({
                status: "success",
                title: "Book edited successfully.",
                duration: 2000,
                position: "top-center",
            })
            onClose()
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
            window.location.reload();
        }
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
    <>
        <Button onClick={onOpen} mr={3} variant="outline" color={"blue.500"} _hover={{bg: "#3A3A3A"}}>
                <BiEditAlt size={20}/>
        </Button>
            <Modal 
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <form onSubmit={handleEditBook}>
                <ModalContent bg={"#1E1E1E"}>
                    <ModalHeader color={"white"}>Edit Book</ModalHeader>
                    <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Flex alignItems={"center"} gap={4} flexDirection="column">
                                <FormControl>
                                    <FormLabel color={"white"}>Title</FormLabel>
                                    <Input placeholder="" color={"white"}
                                        value={inputs.tytul}
                                        onChange={(e) => setInputs((prev) => ({...prev, tytul: e.target.value}))}
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel color={"white"}>Author</FormLabel>
                                    <Input placeholder="" color={"white"}
                                        value={inputs.autor}
                                        onChange={(e) => setInputs((prev) => ({...prev, autor: e.target.value}))}
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel color={"white"}>Year</FormLabel>
                                    <Input placeholder="" color={"white"}
                                        value={inputs.rok_wydania}
                                        onChange={(e) => setInputs((prev) => ({...prev, rok_wydania: e.target.value}))}
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel color={"white"}>Category</FormLabel>
                                    <Input placeholder="" color={"white"}
                                        value={inputs.kategoria}
                                        onChange={(e) => setInputs((prev) => ({...prev, kategoria: e.target.value}))}
                                    ></Input>
                                </FormControl>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" textColor={"white"} mr={3} onClick={onClose} _hover={{bg: "#3A3A3A"}}>Cancel</Button>
                            <Button variant="outline" textColor="blue.500" _hover={{bg: "#3A3A3A"}} type='submit' isLoading={isLoading}>Edit</Button>
                        </ModalFooter>
                </ModalContent>
                </form>
            
            </Modal>
    </>
    )

}

export default EditBook