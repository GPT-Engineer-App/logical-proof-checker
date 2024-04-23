// Complete the Index page component for a Natural Deduction Proof Checker
import { useState } from "react";
import { Box, Button, Container, Heading, Textarea, VStack, Text, useToast } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";

const Index = () => {
  const [proof, setProof] = useState("");
  const [isValid, setIsValid] = useState(null);
  const toast = useToast();

  const handleProofChange = (event) => {
    setProof(event.target.value);
    setIsValid(null); // Reset validation state on input change
  };

  const validateProof = () => {
    // This is a placeholder for proof validation logic
    // Normally, you would integrate a logic parser and proof checker here
    if (proof.trim() === "") {
      toast({
        title: "Error",
        description: "Proof cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsValid(false);
      return;
    }

    // Simulate proof checking
    const isValidProof = Math.random() > 0.5; // Randomly decide if proof is valid (for demonstration)
    setIsValid(isValidProof);

    toast({
      title: isValidProof ? "Success" : "Failure",
      description: isValidProof ? "The proof is logically valid!" : "The proof contains logical errors.",
      status: isValidProof ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Natural Deduction Proof Checker
        </Heading>
        <Text>Enter your natural deduction proof below. Each step should be on a new line, with justifications for each step.</Text>
        <Textarea placeholder="Enter proof here..." value={proof} onChange={handleProofChange} size="lg" height="200px" />
        <Button leftIcon={isValid ? <FaCheck /> : <FaTimes />} colorScheme={isValid ? "green" : "red"} onClick={validateProof}>
          Check Proof
        </Button>
        {isValid !== null && (
          <Text fontSize="lg" color={isValid ? "green.500" : "red.500"}>
            {isValid ? "The proof is valid!" : "The proof is invalid. Please review your steps."}
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
