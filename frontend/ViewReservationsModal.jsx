import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import ReservationStack from "./ReservationStack";
import { Text, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { TbFileTime } from "react-icons/tb";


const ViewReservationsModal = ({ reservations, setReservations}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
    <>
        <Button onClick={onOpen} mr={3} variant="outline" color={"yellow.500"} _hover={{bg: "#3A3A3A"}}>
            <TbFileTime />
            Reservations
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
                        Reservations:
                    </Text >
                </ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <ReservationStack reservations={reservations} setReservations={setReservations}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{bg: "#3A3A3A"}} onClick={onClose}>Close</Button>
                    </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
  )
}
export default ViewReservationsModal;