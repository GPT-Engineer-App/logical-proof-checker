// Complete the Index page component for a Natural Deduction Proof Checker
import { useState } from "react";
import { Button, Container, Heading, Input, VStack, Text, useToast, HStack, IconButton } from "@chakra-ui/react";
import { FaCheck, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [proofLines, setProofLines] = useState([{ proof: "", justification: "" }]);
  const [isValid, setIsValid] = useState(null);
  const toast = useToast();

  const handleProofChange = (index, value, field) => {
    const newProofLines = proofLines.map((line, i) => {
      if (i === index) {
        return { ...line, [field]: value };
      }
      return line;
    });
    setProofLines(newProofLines);
    setIsValid(null);
  };

  const addProofLine = () => {
    setProofLines([...proofLines, { proof: "", justification: "" }]);
  };

  const removeProofLine = (index) => {
    if (proofLines.length > 1) {
      const newProofLines = proofLines.filter((_, i) => i !== index);
      setProofLines(newProofLines);
    }
  };

  const validateProof = () => {
    // This is a placeholder for proof validation logic
    // Normally, you would integrate a logic parser and proof checker here
    let allProofsEmpty = proofLines.every((line) => line.proof.trim() === "");
    if (allProofsEmpty) {
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
    const isValidProof = proofLines.every((line) => Math.random() > 0.5);
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
        {proofLines.map((line, index) => (
          <HStack key={index} spacing={4} align="center">
            <Input placeholder="Enter proof here..." value={line.proof} onChange={(e) => handleProofChange(index, e.target.value, "proof")} size="lg" />
            <Input placeholder="Justification..." value={line.justification} onChange={(e) => handleProofChange(index, e.target.value, "justification")} size="lg" />
            <IconButton icon={<FaPlus />} onClick={addProofLine} aria-label="Add line" />
            {proofLines.length > 1 && <IconButton icon={<FaTrash />} onClick={() => removeProofLine(index)} aria-label="Remove line" />}
          </HStack>
        ))}
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
