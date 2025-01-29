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
    Checkbox,
    Stack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BASE_URL } from "../App";
import { FiUserPlus } from "react-icons/fi";


const AddUserModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState({ imie: "", nazwisko: "", email: "", haslo: "" });
    const [isClient, setIsClient] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [clientData, setClientData] = useState({ telefon: "" });
    const [employeeData, setEmployeeData] = useState({ rola: "" });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleChange = (setData) => (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const fetchUserIdByEmail = async (email) => {
        try {
            const res = await fetch(`${BASE_URL}/uzytkownicy?email=${email}`);
            if (!res.ok) throw new Error("Failed to fetch user ID.");
    
            const users = await res.json();
            console.log("Users found:", users);
    
            const user = users.find((u) => u.email === email);
            if (!user) throw new Error("User not found.");
    
            return user.id_uzytkownika;
        } catch (err) {
            console.error("Error fetching user ID:", err);
            throw err;
        }
    };
    
    const validateInput = () => {
        if (!userData.imie.trim() || !userData.nazwisko.trim() || !userData.email.trim() || !userData.haslo.trim()) {
            toast({
                title: "All user fields are required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return false;
        }
    
        if (isClient && !clientData.telefon.trim()) {
            toast({
                title: "Client phone number is required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return false;
        }
    
        if (isEmployee && !employeeData.rola.trim()) {
            toast({
                title: "Employee role is required.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return false;
        }
    
        return true;
    };
    
    const handleSubmit = async () => {
        if (!validateInput()) return;
    
        setIsLoading(true);
    
        try {
            const userRes = await fetch(`${BASE_URL}/uzytkownicy`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
    
            if (!userRes.ok) {
                const errorText = await userRes.text();
                console.error("Error creating user:", errorText);
                throw new Error("Failed to create user.");
            }
    
            console.log("User created successfully. Now fetching user ID...");
    
            const userId = await fetchUserIdByEmail(userData.email);
            console.log("Found user ID:", userId);
    
            if (isClient) {
                const clientPayload = {
                    ...clientData,
                    id_uzytkownika: String(userId),
                    zaleglosci: "0",
                };
    
                console.log("Sending client data:", clientPayload);
    
                const clientRes = await fetch(`${BASE_URL}/klienci`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(clientPayload),
                });
    
                if (!clientRes.ok) {
                    const errorText = await clientRes.text();
                    console.error("Error creating client:", errorText);
                    throw new Error("Failed to create client.");
                }
    
                console.log("Client created successfully.");
            }
    
            if (isEmployee) {
                const employeePayload = {
                    ...employeeData,
                    id_uzytkownika: String(userId),
                };
    
                console.log("Sending employee data:", employeePayload);
    
                const employeeRes = await fetch(`${BASE_URL}/pracownicy`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(employeePayload),
                });
    
                if (!employeeRes.ok) {
                    const errorText = await employeeRes.text();
                    console.error("Error creating employee:", errorText);
                    throw new Error("Failed to create employee.");
                }
    
                console.log("Employee created successfully.");
            }
    
            toast({
                title: "User created successfully!",
                status: "success",
                duration: 2000,
                position: "top-center",
            });
    
            setUserData({ imie: "", nazwisko: "", email: "", haslo: "" });
            setClientData({ telefon: "" });
            setEmployeeData({ rola: "" });
            setIsClient(false);
            setIsEmployee(false);
            onClose();
        } catch (err) {
            toast({
                title: "Error creating user.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <>
            <Button onClick={onOpen} color="green.500" variant={"outline"} _hover={{bg: "#3A3A3A"}}>
                <FiUserPlus />Add User
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
                <ModalOverlay />
                <ModalContent bg={"#0F0F0F"}>
                    <ModalHeader color={"white"}>Add New User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Stack spacing={4}>
                            {/* USER */}
                            <FormControl>
                                <FormLabel color="white">First Name</FormLabel>
                                <Input
                                    name="imie"
                                    value={userData.imie}
                                    onChange={handleChange(setUserData)}
                                    placeholder="Enter first name"
                                    color="white"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color="white">Last Name</FormLabel>
                                <Input
                                    name="nazwisko"
                                    value={userData.nazwisko}
                                    onChange={handleChange(setUserData)}
                                    placeholder="Enter last name"
                                    color="white"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color="white">Email</FormLabel>
                                <Input
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange(setUserData)}
                                    placeholder="Enter email"
                                    color="white"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color="white">Password</FormLabel>
                                <Input
                                    name="haslo"
                                    value={userData.haslo}
                                    onChange={handleChange(setUserData)}
                                    placeholder="Enter password"
                                    color="white"
                                    type="password"
                                />
                            </FormControl>

                            {/* CUSTOMER */}
                            <Checkbox
                                isChecked={isClient}
                                onChange={(e) => setIsClient(e.target.checked)}
                                color="white"
                            >
                                Add as Client
                            </Checkbox>
                            {isClient && (
                                <Stack pl={6} borderLeft="2px solid #3A3A3A">
                                    <FormControl>
                                        <FormLabel color="white">Phone</FormLabel>
                                        <Input
                                            name="telefon"
                                            value={clientData.telefon}
                                            onChange={handleChange(setClientData)}
                                            placeholder="Enter phone number"
                                            color="white"
                                        />
                                    </FormControl>
                                </Stack>
                            )}

                            {/* EMPLOYEE */}
                            <Checkbox
                                isChecked={isEmployee}
                                onChange={(e) => setIsEmployee(e.target.checked)}
                                color="white"
                            >
                                Add as Employee
                            </Checkbox>
                            {isEmployee && (
                                <Stack pl={6} borderLeft="2px solid #3A3A3A">
                                    <FormControl>
                                        <FormLabel color="white">Role</FormLabel>
                                        <Input
                                            name="rola"
                                            value={employeeData.rola}
                                            onChange={handleChange(setEmployeeData)}
                                            placeholder="Enter role"
                                            color="white"
                                        />
                                    </FormControl>
                                </Stack>
                            )}
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={handleSubmit}
                            colorScheme="green"
                            isLoading={isLoading}
                            mr={3}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            color="white"
                            onClick={onClose}
                            _hover={{ bg: "#3A3A3A" }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddUserModal;
