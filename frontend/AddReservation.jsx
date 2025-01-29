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
import { useDisclosure } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { useState, useEffect } from "react";

const AddReservation = ({ reservations, setReservations, book }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [availableCopies, setAvailableCopies] = useState(false); // Przechowuje dostępność dla danej książki
    const [inputs, setInputs] = useState({
        id_klienta: "",
        id_ksiazki: book.id_ksiazki,
        data_rezerwacji: "",
        termin_waznosci: "",
    });

    // ✅ Funkcja sprawdzająca dostępność egzemplarzy dla danej książki
    const checkAvailableCopies = async () => {
        try {
            const res = await fetch(`${BASE_URL}/egzemplarze?id_ksiazki=${book.id_ksiazki}`);
            if (!res.ok) throw new Error("Failed to fetch copies");

            const copies = await res.json();
            console.log(`Fetched copies for book ${book.id_ksiazki}:`, copies);

            // Sprawdzenie, czy istnieje egzemplarz ze stanem "dostepna"
            const hasAvailableCopy = copies.some((copy) => copy.stan.trim().toLowerCase() === "dostepna");
            console.log(`Book ${book.id_ksiazki} has available copy:`, hasAvailableCopy);
            setAvailableCopies(hasAvailableCopy);
        } catch (err) {
            console.error("Error fetching copies:", err);
            setAvailableCopies(false);
        }
    };

    // ✅ Sprawdzenie dostępnych egzemplarzy po załadowaniu komponentu
    useEffect(() => {
        checkAvailableCopies();
    }, [book.id_ksiazki]);

    const handleAddReservation = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!inputs.id_klienta || !inputs.data_rezerwacji || !inputs.termin_waznosci) {
            toast({
                status: "error",
                title: "All fields are required.",
                duration: 2000,
                position: "top-center",
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(BASE_URL + "/rezerwacje", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }
            toast({
                status: "success",
                title: "Book reserved.",
                duration: 2000,
                position: "top-center",
            });
            onClose();
            setReservations((prevReservations) => [...prevReservations, data]);
            checkAvailableCopies(); // Sprawdzamy ponownie dostępność egzemplarzy po rezerwacji
        } catch (error) {
            toast({
                status: "error",
                title: "An error occurred.",
                description: error.message,
                duration: 2000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
            setInputs({
                id_klienta: "",
                data_rezerwacji: "",
                termin_waznosci: "",
            });
        }
    };

    return (
        <>
            <Flex justifyContent="flex-end" mb={3}>
                <Button
                    onClick={onOpen}
                    mr={3}
                    variant="outline"
                    color={"yellow.500"}
                    _hover={{ bg: "#3A3A3A" }}
                    isDisabled={!availableCopies} // ✅ Przycisk wyłączony tylko dla książki bez dostępnych egzemplarzy
                >
                    Reserve available copy
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleAddReservation}>
                    <ModalContent bg={"#1E1E1E"}>
                        <ModalHeader color={"white"}>Add Reservation</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Flex alignItems={"center"} gap={4} flexDirection="column">
                                <FormControl>
                                    <FormLabel textColor={"white"}>Client Id</FormLabel>
                                    <Input
                                        placeholder="1"
                                        textColor={"white"}
                                        value={inputs.id_klienta}
                                        onChange={(e) => setInputs({ ...inputs, id_klienta: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel textColor={"white"}>Reservation date</FormLabel>
                                    <Input
                                        placeholder="yyyy-mm-dd"
                                        textColor={"white"}
                                        value={inputs.data_rezerwacji}
                                        onChange={(e) => setInputs({ ...inputs, data_rezerwacji: e.target.value })}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel textColor={"white"}>Deadline</FormLabel>
                                    <Input
                                        placeholder="yyyy-mm-dd"
                                        textColor={"white"}
                                        value={inputs.termin_waznosci}
                                        onChange={(e) => setInputs({ ...inputs, termin_waznosci: e.target.value })}
                                    />
                                </FormControl>
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                textColor={"white"}
                                mr={3}
                                onClick={onClose}
                                _hover={{ bg: "#3A3A3A" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                color="green.500"
                                _hover={{ bg: "#3A3A3A" }}
                                type="submit"
                                isLoading={isLoading}
                            >
                                Reserve
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};

export default AddReservation;
