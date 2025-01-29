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

function EditReservation({reservation, setReservations}) {
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        id_klienta: reservation.id_klienta,
        id_ksiazki: reservation.id_ksiazki,
        id_rezerwacji: reservation.id_rezerwacji,
        data_rezerwacji: reservation.data_rezerwacji,
        termin_waznosci: reservation.termin_waznosci,
    })
    const toast = useToast()
    const handleEditReservation = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (
            !inputs.id_klienta ||
            !inputs.id_ksiazki ||
            !inputs.id_rezerwacji ||
            !inputs.data_rezerwacji ||
            !inputs.termin_waznosci
        ) {
            toast({
                status: "error",
                title: "All fields are required.",
                duration: 50000,
                position: "top-center",
            })
            setIsLoading(false)
            return;
        }

        try {
            const res = await fetch(BASE_URL + "/rezerwacje/" + reservation.id_rezerwacji, {
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
            setReservations((prevReservations) => prevReservations.map((r) => r.id_rezerwacji === reservation.id_rezerwacji ? data : r))
            toast({
                status: "success",
                title: "Reservation edited successfully.",
                duration: 50000,
                position: "top-center",
            })
            onClose()
        } catch (error) {
            toast({
                status: "error",
                title: "An error occured.",
                description: error.message,
                duration: 50000,
                position: "top-center",
            })
        } finally {
            setIsLoading(false)
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
                <form onSubmit={handleEditReservation}>
                <ModalContent bg={"#1E1E1E"}>
                    <ModalHeader color={"white"}>Edit Reservation</ModalHeader>
                    <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Flex alignItems={"center"} gap={4} flexDirection="column">
                                <FormControl>
                                    <FormLabel color={"white"}>Deadline</FormLabel>
                                    <Input placeholder="" color={"white"}
                                        value={inputs.termin_waznosci}
                                        onChange={(e) => setInputs((prev) => ({...prev, termin_waznosci: e.target.value}))}
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

export default EditReservation