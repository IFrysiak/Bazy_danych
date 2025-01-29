import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    Box,
    Flex,
    Stack,
    Spinner,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { AiOutlineWarning } from "react-icons/ai";
import { useState } from "react";
import { BASE_URL } from "../App";

const ViewPenaltiesModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [penalties, setPenalties] = useState([]);
    const [filteredPenalties, setFilteredPenalties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [clientId, setClientId] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPenalty, setEditingPenalty] = useState(null);
    const toast = useToast();

    const fetchPenalties = async () => {
        if (!clientId.trim()) {
            toast({
                title: "Client ID is required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/kary`);
            const penaltiesData = await res.json();
            if (!res.ok) throw new Error(penaltiesData.error);

            const resLoans = await fetch(`${BASE_URL}/wypozyczenia`);
            const loansData = await resLoans.json();
            if (!resLoans.ok) throw new Error(loansData.error);

            // Filter penalties by clientId
            const filtered = penaltiesData.filter((penalty) => {
                const loan = loansData.find(
                    (loan) => loan.id_wypozyczenia === penalty.id_wypozyczenia
                );
                return loan && loan.id_klienta === parseInt(clientId, 10);
            });

            setFilteredPenalties(filtered);

            if (filtered.length === 0) {
                toast({
                    title: "No penalties found.",
                    description: `No penalties found for client ID: ${clientId}`,
                    status: "info",
                    duration: 2000,
                    position: "top-center",
                });
            }
        } catch (err) {
            toast({
                title: "Error fetching penalties.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const payPenalty = async (penaltyId) => {
        try {
            const res = await fetch(`${BASE_URL}/kary/${penaltyId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oplacona: true }),
            });
            const updatedPenalty = await res.json();
            if (!res.ok) throw new Error(updatedPenalty.error);

            setFilteredPenalties((prevPenalties) =>
                prevPenalties.map((penalty) =>
                    penalty.id_kary === penaltyId
                        ? { ...penalty, oplacona: true }
                        : penalty
                )
            );

            toast({
                title: "Penalty paid successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });
        } catch (err) {
            toast({
                title: "Error paying penalty.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    const editPenalty = (penalty) => {
        setEditingPenalty({ ...penalty });
        setIsEditOpen(true);
    };

    const savePenalty = async () => {
        try {
            const res = await fetch(`${BASE_URL}/kary/${editingPenalty.id_kary}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    kwota: editingPenalty.kwota,
                    data_ostatniego_naliczenia: editingPenalty.data_ostatniego_naliczenia,
                }),
            });
            const updatedPenalty = await res.json();
            if (!res.ok) throw new Error(updatedPenalty.error);

            setFilteredPenalties((prevPenalties) =>
                prevPenalties.map((penalty) =>
                    penalty.id_kary === editingPenalty.id_kary
                        ? { ...penalty, ...updatedPenalty }
                        : penalty
                )
            );

            toast({
                title: "Penalty updated successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });

            setIsEditOpen(false);
            setEditingPenalty(null);
        } catch (err) {
            toast({
                title: "Error updating penalty.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    return (
        <>
            <Button onClick={onOpen} variant="outline" color={"red.500"} _hover={{ bg: "#3A3A3A" }} >
                <AiOutlineWarning />
                Penalties
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"#0F0F0F"}>
                    <ModalHeader color={"white"}>View Penalties</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel color="white">Client ID</FormLabel>
                            <Input
                                placeholder="Enter Client ID"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                color="white"
                            />
                        </FormControl>

                        <Button
                            mt={4}
                            onClick={fetchPenalties}
                            colorScheme="blue"
                            isLoading={isLoading}
                            _hover={{ bg: "#3A3A3A" }}
                        >
                            Fetch Penalties
                        </Button>

                        {isLoading ? (
                            <Flex justifyContent="center" mt={4}>
                                <Spinner size="xl" />
                            </Flex>
                        ) : filteredPenalties.length > 0 ? (
                            <Stack gap="4" mt={4}>
                                {filteredPenalties.map((penalty) => (
                                    <Flex key={penalty.id_kary} p={4} bg={"#1E1E1E"} borderRadius="md" justifyContent="space-between">
                                        <Box>
                                            <Text color="white">Penalty ID: {penalty.id_kary}</Text>
                                            <Text color="white" ml="4">
                                                Loan ID: {penalty.id_wypozyczenia}
                                            </Text>
                                            <Text color="white" ml="4">
                                                Amount: {Number(penalty.kwota).toFixed(2)}
                                            </Text>
                                            <Text color="white" ml="4">Date of last charge: {penalty.data_ostatniego_naliczenia}</Text>
                                            <Text color="white" ml="4">
                                                Paid: {penalty.oplacona ? "Yes" : "No"}
                                            </Text>
                                        </Box>
                                        <Box>
                                            {!penalty.oplacona && (
                                                <Button
                                                    onClick={() => payPenalty(penalty.id_kary)}
                                                    colorScheme="green"
                                                    mr={2}
                                                    _hover={{ bg: "green.600" }}
                                                >
                                                    Pay
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => editPenalty(penalty)}
                                                colorScheme="blue"
                                                _hover={{ bg: "blue.600" }}
                                            >
                                                Edit
                                            </Button>
                                        </Box>
                                    </Flex>
                                ))}
                            </Stack>
                        ) : (
                            filteredPenalties.length === 0 && !isLoading && (
                                <Text color="white" textAlign="center" mt={4}>
                                    No penalties found for this client.
                                </Text>
                            )
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{ bg: "#3A3A3A" }} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit Modal */}
            {editingPenalty && (
                <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
                    <ModalOverlay />
                    <ModalContent bg={"#0F0F0F"}>
                        <ModalHeader color={"white"}>Edit Penalty</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl>
                                <FormLabel color="white">Amount</FormLabel>
                                <Input
                                    type="number"
                                    value={editingPenalty.kwota}
                                    onChange={(e) =>
                                        setEditingPenalty({ ...editingPenalty, kwota: e.target.value })
                                    }
                                    color="white"
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel color="white">Date</FormLabel>
                                <Input
                                    value={editingPenalty.data_ostatniego_naliczenia}
                                    onChange={(e) =>
                                        setEditingPenalty({ ...editingPenalty, data_ostatniego_naliczenia: e.target.value })
                                    }
                                    color="white"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                color="white"
                                _hover={{ bg: "#3A3A3A" }}
                                onClick={() => setIsEditOpen(false)}
                                mr={3}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                colorScheme="blue"
                                _hover={{ bg: "blue.600" }}
                                onClick={savePenalty}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default ViewPenaltiesModal;
