import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import LoanStack from "./LoanStack";
import { Text, Button } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { AiOutlineUnorderedList } from "react-icons/ai";


const ViewLoansModal = ({ loans, setLoans}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
    <>
        <Button onClick={onOpen} mr={3} variant="outline" color={"blue.500"} _hover={{bg: "#3A3A3A"}}>
            <AiOutlineUnorderedList />
            Loans
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
                        Loans:
                    </Text >
                </ModalHeader>
                <ModalCloseButton />
                    <ModalBody pb={6}>
                        <LoanStack loans={loans} setLoans={setLoans}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{bg: "#3A3A3A"}} onClick={onClose}>Close</Button>
                    </ModalFooter>
            </ModalContent>
            
        </Modal>
    </>
  )
}
export default ViewLoansModal;