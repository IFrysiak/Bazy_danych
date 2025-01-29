import React, { useState } from "react";
import { Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { useDisclosure } from "@chakra-ui/react";
import { BASE_URL } from "../App";

function EditLoan({ loan, setLoans }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const [inputs, setInputs] = useState({
        id_klienta: loan.id_klienta,
        id_egzemplarza: loan.id_egzemplarza,
        id_wypozyczenia: loan.id_wypozyczenia,
        data_wypozyczenia: loan.data_wypozyczenia,
        termin_zwrotu: loan.termin_zwrotu,
        data_faktycznego_zwrotu: loan.data_faktycznego_zwrotu || "",
    });

    const handleEditLoan = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updatedLoan = { ...inputs };

        if (!updatedLoan.data_faktycznego_zwrotu.trim()) {
            delete updatedLoan.data_faktycznego_zwrotu;
        }

        try {
            const res = await fetch(`${BASE_URL}/wypozyczenia/${loan.id_wypozyczenia}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedLoan),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }

            setLoans((prevLoans) =>
                prevLoans.map((l) => (l.id_wypozyczenia === loan.id_wypozyczenia ? data : l))
            );

            toast({
                status: "success",
                title: "Loan edited successfully.",
                duration: 5000,
                position: "top-center",
            });

            onClose();
        } catch (error) {
            toast({
                status: "error",
                title: "An error occurred.",
                description: error.message,
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={onOpen} mr={3} variant="outline" color={"blue.500"} _hover={{ bg: "#3A3A3A" }}>
                <BiEditAlt size={20} />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleEditLoan}>
                    <ModalContent bg={"#1E1E1E"}>
                        <ModalHeader color={"white"}>Edit Loan</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Flex alignItems={"center"} gap={4} flexDirection="column">
                                <FormControl>
                                    <FormLabel color={"white"}>Deadline</FormLabel>
                                    <Input
                                        placeholder=""
                                        color={"white"}
                                        value={inputs.termin_zwrotu}
                                        onChange={(e) => setInputs((prev) => ({ ...prev, termin_zwrotu: e.target.value }))}
                                    ></Input>
                                </FormControl>
                                <FormControl>
                                    <FormLabel color={"white"}>Return date (optional)</FormLabel>
                                    <Input
                                        placeholder="yyyy-mm-dd (leave empty if not returned)"
                                        color={"white"}
                                        value={inputs.data_faktycznego_zwrotu}
                                        onChange={(e) => setInputs((prev) => ({ ...prev, data_faktycznego_zwrotu: e.target.value }))}
                                    ></Input>
                                </FormControl>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" textColor={"white"} mr={3} onClick={onClose} _hover={{ bg: "#3A3A3A" }}>
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                textColor="blue.500"
                                _hover={{ bg: "#3A3A3A" }}
                                type="submit"
                                isLoading={isLoading}
                            >
                                Edit
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
}

export default EditLoan;
