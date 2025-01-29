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
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { BASE_URL } from "../App";
import EditLoan from "./EditLoan";
import EditReservation from "./EditReservation";

const ViewLoansAndReservationsModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clientId, setClientId] = useState("");
    const [loans, setLoans] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const fetchLoansAndReservations = async () => {
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
            // Fetch loans
            const resLoans = await fetch(`${BASE_URL}/wypozyczenia`);
            const loansData = await resLoans.json();
            if (!resLoans.ok) throw new Error(loansData.error);

            // Fetch reservations
            const resReservations = await fetch(`${BASE_URL}/rezerwacje`);
            const reservationsData = await resReservations.json();
            if (!resReservations.ok) throw new Error(reservationsData.error);

            // Filter by clientId
            const filteredLoans = loansData.filter(
                (loan) => loan.id_klienta === parseInt(clientId, 10)
            );
            const filteredReservations = reservationsData.filter(
                (reservation) => reservation.id_klienta === parseInt(clientId, 10)
            );

            setLoans(filteredLoans);
            setReservations(filteredReservations);

            if (filteredLoans.length === 0 && filteredReservations.length === 0) {
                toast({
                    title: "No results found.",
                    description: `No loans or reservations found for client ID: ${clientId}`,
                    status: "info",
                    duration: 2000,
                    position: "top-center",
                });
            }
        } catch (err) {
            toast({
                title: "Error fetching data.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReservation = async (reservationId) => {
        try {
            const res = await fetch(`${BASE_URL}/rezerwacje/${reservationId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete reservation.");
            }

            setReservations((prevReservations) =>
                prevReservations.filter((reservation) => reservation.id_rezerwacji !== reservationId)
            );

            toast({
                title: "Reservation deleted successfully.",
                status: "success",
                duration: 2000,
                position: "top-center",
            });
        } catch (err) {
            toast({
                title: "Error deleting reservation.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    return (
        <>
            <Button onClick={onOpen} variant="outline" color={"blue.500"} _hover={{ bg: "#3A3A3A" }} mr={3}>
                <AiOutlineUnorderedList />
                View Loans & Reservations
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
                <ModalOverlay />
                <ModalContent bg={"#0F0F0F"}>
                    <ModalHeader color={"white"}>Loans & Reservations</ModalHeader>
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
                            onClick={fetchLoansAndReservations}
                            colorScheme="blue"
                            isLoading={isLoading}
                            _hover={{ bg: "#3A3A3A" }}
                        >
                            Fetch
                        </Button>

                        {isLoading ? (
                            <Flex justifyContent="center" mt={4}>
                                <Spinner size="xl" />
                            </Flex>
                        ) : (
                            <Stack gap="4" mt={4}>
                                {loans.length > 0 && (
                                    <Box>
                                        <Text fontSize="xl" color="white" mb={2}>
                                            Loans:
                                        </Text>
                                        {loans
                                            .filter((loan) => !loan.data_faktycznego_zwrotu)
                                            .map((loan) => (
                                                <Flex
                                                    key={loan.id_wypozyczenia}
                                                    p={4}
                                                    bg={"#1E1E1E"}
                                                    borderRadius="md"
                                                    justifyContent="space-between"
                                                >
                                                    <Box>
                                                        <Text color="white">
                                                            Loan ID: {loan.id_wypozyczenia}
                                                        </Text>
                                                        <Text color="white">
                                                            Copy ID: {loan.id_egzemplarza}
                                                        </Text>
                                                        <Text color="white">
                                                            Loan Date: {loan.data_wypozyczenia}
                                                        </Text>
                                                        <Text color="white">
                                                            Return Deadline: {loan.termin_zwrotu}
                                                        </Text>
                                                    </Box>
                                                    <EditLoan loan={loan} setLoans={setLoans} />
                                                </Flex>
                                            ))}
                                    </Box>
                                )}

                                {reservations.length > 0 && (
                                    <Box>
                                        <Text fontSize="xl" color="white" mb={2}>
                                            Reservations:
                                        </Text>
                                        {reservations.map((reservation) => (
                                            <Flex
                                                key={reservation.id_rezerwacji}
                                                p={4}
                                                bg={"#1E1E1E"}
                                                borderRadius="md"
                                                justifyContent="space-between"
                                            >
                                                <Box>
                                                    <Text color="white">
                                                        Reservation ID: {reservation.id_rezerwacji}
                                                    </Text>
                                                    <Text color="white">
                                                        Book ID: {reservation.id_ksiazki}
                                                    </Text>
                                                    <Text color="white">
                                                        Reservation Date: {reservation.data_rezerwacji}
                                                    </Text>
                                                    <Text color="white">
                                                        Expiration: {reservation.termin_waznosci}
                                                    </Text>
                                                </Box>
                                                <Flex alignItems="center" gap={2}>
                                                    <EditReservation
                                                        reservation={reservation}
                                                        setReservations={setReservations}
                                                    />
                                                    <IconButton
                                                        icon={<BiTrash />}
                                                        colorScheme="red"
                                                        variant="outline"
                                                        onClick={() => deleteReservation(reservation.id_rezerwacji)}
                                                        _hover={{ bg: "#3A3A3A" }}
                                                    />
                                                </Flex>
                                            </Flex>
                                        ))}
                                    </Box>
                                )}
                            </Stack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            color="white"
                            _hover={{ bg: "#3A3A3A" }}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ViewLoansAndReservationsModal;
