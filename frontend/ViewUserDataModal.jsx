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
    Stack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BASE_URL } from "../App";
import { MdAccountCircle } from "react-icons/md"

const ViewUserDataModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const { isOpen: isInputModalOpen, onOpen: openInputModal, onClose: closeInputModal } = useDisclosure();
    
    const [userId, setUserId] = useState(""); 
    const [userData, setUserData] = useState(null); 
    const [isEditing, setIsEditing] = useState({ user: false, client: false, employee: false }); 
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const fetchUserData = async () => {
        if (!userId.trim()) {
            toast({
                title: "User ID is required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }

        setIsLoading(true);

        try {
            const [clientsRes, employeesRes, usersRes] = await Promise.all([
                fetch(`${BASE_URL}/klienci`),
                fetch(`${BASE_URL}/pracownicy`),
                fetch(`${BASE_URL}/uzytkownicy`),
            ]);

            const clientsData = clientsRes.ok ? await clientsRes.json() : [];
            const employeesData = employeesRes.ok ? await employeesRes.json() : [];
            const usersData = usersRes.ok ? await usersRes.json() : [];

            const clientData = clientsData.find((client) => client.id_uzytkownika === parseInt(userId, 10)) || null;
            const employeeData = employeesData.find((employee) => employee.id_uzytkownika === parseInt(userId, 10)) || null;
            const user = usersData.find((user) => user.id_uzytkownika === parseInt(userId, 10)) || null;

            if (!user && !clientData && !employeeData) {
                throw new Error("User not found.");
            }

            setUserData({
                user,
                client: clientData,
                employee: employeeData,
            });

            closeInputModal();
            onOpen();
        } catch (err) {
            toast({
                title: "Error fetching user data.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (role) => {
        setIsEditing((prev) => ({ ...prev, [role]: !prev[role] }));
    };

    const handleSave = async (role) => {
        try {
            const endpoint = role === "user" ? "uzytkownicy" : role === "client" ? "klienci" : "pracownicy";
            const idField = role === "user" ? "id_uzytkownika" : role === "client" ? "id_klienta" : "id_pracownika";

            const updatedData = userData[role];

            const res = await fetch(`${BASE_URL}/${endpoint}/${updatedData[idField]}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                throw new Error("Failed to update data.");
            }

            toast({
                title: `${role.charAt(0).toUpperCase() + role.slice(1)} data updated successfully.`,
                status: "success",
                duration: 2000,
                position: "top-center",
            });

            setIsEditing((prev) => ({ ...prev, [role]: false })); 
        } catch (err) {
            toast({
                title: "Error updating data.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    const handleChange = (role, field, value) => {
        setUserData((prev) => ({
            ...prev,
            [role]: {
                ...prev[role],
                [field]: value,
            },
        }));
    };

    return (
        <>
            <Button onClick={openInputModal} color="white" variant={"outline"} _hover={{bg: "#3A3A3A"}}>
                <MdAccountCircle size={20}/>
            </Button>

            <Modal isOpen={isInputModalOpen} onClose={closeInputModal} size={"md"}>
                <ModalOverlay />
                <ModalContent bg={"#0F0F0F"}>
                    <ModalHeader color={"white"}>Enter User ID</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel color="white">User ID</FormLabel>
                            <Input
                                placeholder="Enter User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                color="white"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={fetchUserData} colorScheme="blue" mr={3} isLoading={isLoading}>
                            Fetch Data
                        </Button>
                        <Button variant="outline" color="white" onClick={closeInputModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {userData && (
                <Modal isOpen={isOpen} onClose={() => setUserData(null)} size={"xl"}>
                    <ModalOverlay />
                    <ModalContent bg={"#0F0F0F"}>
                        <ModalHeader color={"white"}>User Data</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <Stack gap="4">
                                {["user", "client", "employee"].map((role) => {
                                    if (!userData[role]) return null;
                                    return (
                                        <Box
                                            key={role}
                                            p={4}
                                            bg={"#1E1E1E"}
                                            borderRadius="md"
                                            border={"1px solid #3A3A3A"}
                                        >
                                            <Text color="white" fontWeight="bold" mb={2}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)} Information:
                                            </Text>
                                            {Object.keys(userData[role]).map((key) => (
                                                <FormControl key={key} mb={2}>
                                                    <FormLabel color="white">{key}</FormLabel>
                                                    <Input
                                                        value={userData[role][key]}
                                                        onChange={(e) => handleChange(role, key, e.target.value)}
                                                        isDisabled={!isEditing[role]}
                                                        color="white"
                                                    />
                                                </FormControl>
                                            ))}
                                            <Button
                                                mt={2}
                                                onClick={() => isEditing[role] ? handleSave(role) : handleEdit(role)}
                                                colorScheme={isEditing[role] ? "green" : "blue"}
                                            >
                                                {isEditing[role] ? "Save" : "Edit"}
                                            </Button>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" color="white" onClick={() => setUserData(null)}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default ViewUserDataModal;
