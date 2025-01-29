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
    IconButton,
} from "@chakra-ui/react";
import { AiOutlineWarning } from "react-icons/ai";
import { BiTrash, BiEdit, BiPlus } from "react-icons/bi";
import { useState, useEffect } from "react";
import { BASE_URL } from "../App";

const ViewAllPenaltiesModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [penalties, setPenalties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newPenalty, setNewPenalty] = useState({
        id_wypozyczenia: "",
        kwota: "",
        data_ostatniego_naliczenia: "",
        oplacona: false,
    });
    const [editingPenalty, setEditingPenalty] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const toast = useToast();

    const fetchPenalties = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/kary`);
            const penaltiesData = await res.json();
            if (!res.ok) throw new Error(penaltiesData.error);
            setPenalties(penaltiesData);
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

    const deletePenalty = async (penaltyId) => {
        try {
            const res = await fetch(`${BASE_URL}/kary/${penaltyId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete penalty.");
            }

            setPenalties((prevPenalties) =>
                prevPenalties.filter((penalty) => penalty.id_kary !== penaltyId)
            );

            toast({
                title: "Penalty deleted successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });
        } catch (err) {
            toast({
                title: "Error deleting penalty.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    const addPenalty = async () => {
        if (!newPenalty.id_wypozyczenia || !newPenalty.kwota || !newPenalty.data_ostatniego_naliczenia) {
            toast({
                title: "All fields are required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/kary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPenalty),
            });
            const createdPenalty = await res.json();
            if (!res.ok) throw new Error(createdPenalty.error);

            setPenalties((prevPenalties) => [...prevPenalties, createdPenalty]);

            toast({
                title: "Penalty added successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });

            setNewPenalty({
                id_wypozyczenia: "",
                kwota: "",
                data_ostatniego_naliczenia: "",
                oplacona: false,
            });
        } catch (err) {
            toast({
                title: "Error adding penalty.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    const openEditModal = (penalty) => {
        setEditingPenalty({ ...penalty });
        setIsEditModalOpen(true);
    };

    const saveEditedPenalty = async () => {
        try {
            const res = await fetch(`${BASE_URL}/kary/${editingPenalty.id_kary}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingPenalty),
            });
            const updatedPenalty = await res.json();
            if (!res.ok) throw new Error(updatedPenalty.error);

            setPenalties((prevPenalties) =>
                prevPenalties.map((penalty) =>
                    penalty.id_kary === updatedPenalty.id_kary ? updatedPenalty : penalty
                )
            );

            toast({
                title: "Penalty updated successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });

            setIsEditModalOpen(false);
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

    useEffect(() => {
        if (isOpen) fetchPenalties();
    }, [isOpen]);

    return (
        <>
            <Button onClick={onOpen} variant="outline" color={"red.500"} _hover={{ bg: "#3A3A3A" }}>
                <AiOutlineWarning />
                View All Penalties
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"#0F0F0F"}>
                    <ModalHeader color={"white"}>All Penalties</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {/* Form to Add New Penalty */}
                        <Box mb={4}>
                            <Text color="white" mb={2} fontSize="xl">
                                Add New Penalty:
                            </Text>
                            <FormControl mb={2}>
                                <FormLabel color="white">Loan ID</FormLabel>
                                <Input
                                    value={newPenalty.id_wypozyczenia}
                                    onChange={(e) =>
                                        setNewPenalty({
                                            ...newPenalty,
                                            id_wypozyczenia: e.target.value,
                                        })
                                    }
                                    color="white"
                                />
                            </FormControl>
                            <FormControl mb={2}>
                                <FormLabel color="white">Amount</FormLabel>
                                <Input
                                    type="number"
                                    value={newPenalty.kwota}
                                    onChange={(e) =>
                                        setNewPenalty({ ...newPenalty, kwota: e.target.value })
                                    }
                                    color="white"
                                />
                            </FormControl>
                            <FormControl mb={2}>
                                <FormLabel color="white">Date</FormLabel>
                                <Input
                                    placeholder="yyyy-mm-dd"
                                    value={newPenalty.data_ostatniego_naliczenia}
                                    onChange={(e) =>
                                        setNewPenalty({
                                            ...newPenalty,
                                            data_ostatniego_naliczenia: e.target.value,
                                        })
                                    }
                                    color="white"
                                />
                            </FormControl>
                            <Button
                                onClick={addPenalty}
                                colorScheme="green"
                                mt={2}
                                _hover={{ bg: "green.600" }}
                            >
                                <BiPlus />
                                Add Penalty
                            </Button>
                        </Box>

                        {isLoading ? (
                            <Flex justifyContent="center" mt={4}>
                                <Spinner size="xl" />
                            </Flex>
                        ) : (
                            <Stack gap="4" mt={4}>
                                {penalties.map((penalty) => (
                                    <Flex
                                        key={penalty.id_kary}
                                        p={4}
                                        bg={"#1E1E1E"}
                                        borderRadius="md"
                                        justifyContent="space-between"
                                    >
                                        <Box>
                                            <Text color="white">Penalty ID: {penalty.id_kary}</Text>
                                            <Text color="white">
                                                Loan ID: {penalty.id_wypozyczenia}
                                            </Text>
                                            <Text color="white">
                                                Amount: {Number(penalty.kwota).toFixed(2)}
                                            </Text>
                                            <Text color="white">
                                                Date of last charge: {penalty.data_ostatniego_naliczenia}
                                            </Text>
                                            <Text color="white">
                                                Paid: {penalty.oplacona ? "Yes" : "No"}
                                            </Text>
                                        </Box>
                                        <Flex alignItems="center" gap={2}>
                                            <Button
                                                onClick={() => openEditModal(penalty)}
                                                colorScheme="blue"
                                            >
                                                <BiEdit />
                                                Edit
                                            </Button>
                                            <IconButton
                                                icon={<BiTrash />}
                                                colorScheme="red"
                                                onClick={() => deletePenalty(penalty.id_kary)}
                                                _hover={{ bg: "#3A3A3A" }}
                                            />
                                        </Flex>
                                    </Flex>
                                ))}
                            </Stack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{ bg: "#3A3A3A" }} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit Penalty Modal */}
            {editingPenalty && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent bg={"#0F0F0F"}>
                        <ModalHeader color={"white"}>Edit Penalty</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl mb={2}>
                                <FormLabel color="white">Loan ID</FormLabel>
                                <Input
                                    value={editingPenalty.id_wypozyczenia}
                                    onChange={(e) =>
                                        setEditingPenalty({
                                            ...editingPenalty,
                                            id_wypozyczenia: e.target.value,
                                        })
                                    }
                                    color="white"
                                />
                            </FormControl>
                            <FormControl mb={2}>
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
                            <FormControl mb={2}>
                                <FormLabel color="white">Date</FormLabel>
                                <Input
                                    value={editingPenalty.data_ostatniego_naliczenia}
                                    onChange={(e) =>
                                        setEditingPenalty({
                                            ...editingPenalty,
                                            data_ostatniego_naliczenia: e.target.value,
                                        })
                                    }
                                    color="white"
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                color="white"
                                mr={3}
                                _hover={{ bg: "#3A3A3A" }}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                _hover={{ bg: "blue.600" }}
                                onClick={saveEditedPenalty}
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

export default ViewAllPenaltiesModal;
