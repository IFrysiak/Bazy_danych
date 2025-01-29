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
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { useState } from "react";


const AddCopy = ({setCopies, book}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        id_ksiazki: book.id_ksiazki,
        stan: "",
    })

    const handleAddCopy = async (e) => {
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
            const res = await fetch(BASE_URL + "/egzemplarze", {
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
                title: "Copy added successfully.",
                duration: 2000,
                position: "top-center",
            })
            onClose()
            setCopies((prevCopies) => [...prevCopies, data])
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
                stan: "",
            }) //clear inputs
            window.location.reload();
        }
    }

    return (
    <>
        <Button onClick={onOpen} mr={3} color={"green.500"} variant={"outline"} _hover={{bg: "#3A3A3A"}}>
                <IoMdAddCircleOutline size={20}/>
        </Button>
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <form onSubmit={handleAddCopy}>
            <ModalContent bg={"#1E1E1E"}>
                <ModalHeader color={"white"}>Add Copy</ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <RadioGroup mt={4} color={"white"}>
							<Flex gap={5}>
								<Radio value='dostepna' onChange={(e) => setInputs({...inputs, stan: e.target.value})} >
									Available
								</Radio>
								<Radio value='zniszczona' onChange={(e) => setInputs({...inputs, stan: e.target.value})} >
									Damaged
								</Radio>
							</Flex>
						</RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" textColor={"white"} mr={3} onClick={onClose} _hover={{bg: "#3A3A3A"}}>Cancel</Button>
                        <Button variant="outline" color="green.500" _hover={{bg: "#3A3A3A"}} type='submit' isLoading={isLoading}>Add</Button>
                    </ModalFooter>
            </ModalContent>
            </form>
        
        </Modal>
    </>
    )
}
export default AddCopy