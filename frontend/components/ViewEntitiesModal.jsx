import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Box,
    Flex,
    Stack,
    Spinner,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { BiUser, BiGroup } from "react-icons/bi";
import { useState } from "react";
import { BASE_URL } from "../App";

const ViewEntitiesModal = () => {
    const [entities, setEntities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [entityType, setEntityType] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const entityTypeMap = {
        klienci: "Clients",
        pracownicy: "Employees",
        uzytkownicy: "Users",
    };

    const fetchEntities = async (type) => {
        setEntityType(type);
        setIsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/${type}`);
            if (!res.ok) throw new Error(`Failed to fetch ${entityTypeMap[type]}`);

            const data = await res.json();
            setEntities(data);
            onOpen();
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

    const handleDelete = async (entity) => {
        if (!entity) {
            console.error("Error: entity is undefined.");
            toast({
                title: "Error deleting entity.",
                description: "Entity data is missing.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }
    
        const entityId =
            entityType === "klienci" ? entity.id_klienta :
            entityType === "pracownicy" ? entity.id_pracownika :
            entityType === "uzytkownicy" ? entity.id_uzytkownika : null;
    
        if (!entityId) {
            console.error("Error: entity ID is undefined.", entity);
            toast({
                title: "Error deleting entity.",
                description: "Entity ID is missing.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }
    
        if (entityType === "klienci" && entity.zaleglosci > 0) {
            toast({
                title: "Cannot delete client.",
                description: "Client has outstanding charges and cannot be deleted.",
                status: "error",
                duration: 2000,
                position: "top-center",
            });
            return;
        }
    
        try {
            const res = await fetch(`${BASE_URL}/${entityType}/${entityId}`, {
                method: "DELETE",
            });
    
            if (!res.ok) throw new Error(`Failed to delete ${entityType}`);
    
            toast({
                title: `${entityTypeMap[entityType]} deleted successfully.`,
                status: "success",
                duration: 2000,
                position: "top-center",
            });
    
            setEntities((prevEntities) => prevEntities.filter((e) => e !== entity));
        } catch (err) {
            toast({
                title: "Error deleting entity.",
                description: err.message,
                status: "error",
                duration: 2000,
                position: "top-center",
            });
        }
    };

    return (
        <>
            <Flex gap={3} mb={4}>
                <Button onClick={() => fetchEntities("klienci")} color="purple.500" variant="outline" leftIcon={<BiUser />}>
                    View Clients
                </Button>
                <Button onClick={() => fetchEntities("pracownicy")} color="purple.500" variant="outline" leftIcon={<BiGroup />}>
                    View Employees
                </Button>
                <Button onClick={() => fetchEntities("uzytkownicy")} color="purple.500" variant="outline" leftIcon={<BiUser />}>
                    View Users
                </Button>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent bg="#0F0F0F">
                    <ModalHeader color="white">{entityTypeMap[entityType] || "Entities"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {isLoading ? (
                            <Flex justifyContent="center">
                                <Spinner size="xl" />
                            </Flex>
                        ) : entities.length > 0 ? (
                            <Stack gap="4">
                                {entities.map((entity, index) => {
                                    const entityId =
                                        entityType === "klienci" ? entity.id_klienta :
                                        entityType === "pracownicy" ? entity.id_pracownika :
                                        entityType === "uzytkownicy" ? entity.id_uzytkownika : null;

                                    return (
                                        <Box key={index} p={4} bg="#1E1E1E" borderRadius="md" border="1px solid #3A3A3A">
                                            {Object.keys(entity).map((key) => (
                                                <Text key={key} color="white">
                                                    {key}: {entity[key]}
                                                </Text>
                                            ))}
                                            {entityId && (
                                                <Button
                                                    mt={2}
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => handleDelete(entity)}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Text color="white" textAlign="center">
                                No data available for {entityTypeMap[entityType]}.
                            </Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" color="white" _hover={{ bg: "#3A3A3A" }} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ViewEntitiesModal;
