import { MdViewList } from "react-icons/md";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import CopyStack from "./CopyStack";
import { Text, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import AddReservation from "./AddReservation";

const CopyModal = ({book, copies, setCopies, loans, setLoans, reservations, setReservations}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
    <>
        <Button onClick={onOpen} mr={3} variant="outline" color={"white"} _hover={{bg: "#3A3A3A"}}>
            <MdViewList/>
        </Button>

        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            size={"xl"}
        >
            <ModalOverlay />
            <ModalContent bg={"#0F0F0F"}>
                <ModalHeader textColor={"white"}>
                    <Text fontSize={"30px"} fontWeight={"bold"} letterSpacing={"2px"} textTransform={"uppercase"} textAlign={"center"} color={"white"}>
                        Copies:
                    </Text >
                </ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <AddReservation reservations={reservations} setReservations={setReservations} book={book}/>
                        <CopyStack book={book} copies={copies} setCopies={setCopies} loans={loans} setLoans={setLoans}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{bg: "#3A3A3A"}} onClick={onClose}>Close</Button>
                    </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
  )
}
export default CopyModal;