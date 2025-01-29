import React, { useState } from 'react'
import { Button, Flex, Radio, RadioGroup, useToast } from "@chakra-ui/react"
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

function EditCopy({book, copy, setCopies}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
        const [inputs, setInputs] = useState({
            id_ksiazki: book.id_ksiazki,
            stan: copy.stan,
    })
    const toast = useToast()
    
    const handleEditCopy = async (e) => {
            e.preventDefault()
            setIsLoading(true)
    
            if (
                !inputs.stan
            ) {
                toast({
                    status: "error",
                    title: "Field is required.",
                    duration: 2000,
                    position: "top-center",
                })
                setIsLoading(false)
                return;
            }
    
            try {
                const res = await fetch(BASE_URL + "/egzemplarze/" + copy.id_egzemplarza, {
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
                setCopies((prevCopies) => prevCopies.map((c) => c.id_egzemplarza === book.id_egzemplarza ? data : c))
                toast({
                    status: "success",
                    title: "Copy edited successfully.",
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
                <form onSubmit={handleEditCopy}>
                <ModalContent bg={"#1E1E1E"}>
                    <ModalHeader color={"white"}>Edit Copy</ModalHeader>
                    <ModalCloseButton />
                        <ModalBody pb={6}>
                        <RadioGroup mt={4} color={"white"}>
							<Flex gap={5}>
								<Radio value='dostepna' onChange={(e) => setInputs((prev) => ({...prev, stan: e.target.value}))}>
									Available
								</Radio>
								<Radio value='zniszczona' onChange={(e) => setInputs((prev) => ({...prev, stan: e.target.value}))}>
									Damaged
								</Radio>
							</Flex>
						</RadioGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" textColor={"white"} mr={3} onClick={onClose} _hover={{bg: "#3A3A3A"}}>Cancel</Button>
                            <Button variant="outline" textColor="blue.500" _hover={{bg: "#3A3A3A"}} type='submit'>Edit</Button>
                        </ModalFooter>
                </ModalContent>
                </form>
            
            </Modal>
    </>
    )

}

export default EditCopy