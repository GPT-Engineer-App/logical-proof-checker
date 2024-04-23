// Complete the Index page component for a Natural Deduction Proof Checker
import { useState } from "react";
import { Button, Container, Heading, Input, VStack, Text, useToast, HStack, IconButton } from "@chakra-ui/react";
import { FaCheck, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [proofLines, setProofLines] = useState([{ proof: "", justification: "" }]);
  const [isValid, setIsValid] = useState(null);
  const toast = useToast();

  const latexToSymbol = {
    "\\forall": "∀",
    "\\exists": "∃",
    "\\wedge": "∧",
    "\\vee": "∨",
    "\\to": "→",
    "\\neg": "¬",
    "\\in": "∈",
    "\\subseteq": "⊆",
    "\\subset": "⊂",
    "\\cup": "∪",
    "\\cap": "∩",
    "\\emptyset": "∅",
  };

  const replaceLatexCommands = (text) => {
    const regex = /\\(forall|exists|wedge|vee|to|neg|in|subseteq|subset|cup|cap|emptyset)/g;
    return text.replace(regex, (match) => latexToSymbol[match] || match);
  };

  const handleProofChange = (index, value, field) => {
    value = replaceLatexCommands(value);
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

  const parseJustification = (justification) => {
    const rulePattern = /([A-Z]+) (\d+)/g;
    let matches,
      rules = [];
    while ((matches = rulePattern.exec(justification)) !== null) {
      rules.push({ rule: matches[1], line: parseInt(matches[2], 10) - 1 });
    }
    return rules;
  };

  const validateProof = () => {
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

    const isValidProof = proofLines.every((line, index) => {
      const rules = parseJustification(line.justification);

      return rules.every((rule) => {
        if (rule.rule === "E∧" && proofLines[rule.line].proof.includes("∧")) {
          const parts = proofLines[rule.line].proof.split("∧").map((part) => part.trim());
          return parts.includes(line.proof.trim());
        }
        return true;
      });
    });

    setIsValid(isValidProof);

    toast({
      title: isValidProof ? "Success" : "Failure",
      description: isValidProof ? "The proof is logically valid!" : "The proof contains logical errors.",
      status: isValidProof ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const symbols = ["∀", "∃", "∧", "∨", "→", "¬", "∈", "⊆", "⊂", "∪", "∩", "∅"];

  const [lastFocused, setLastFocused] = useState(null);

  const handleFocus = (event) => {
    setLastFocused(event.target);
  };

  const insertSymbol = (symbol) => {
    if (lastFocused) {
      const start = lastFocused.selectionStart;
      const end = lastFocused.selectionEnd;
      const text = lastFocused.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      lastFocused.value = before + symbol + after;
      lastFocused.selectionStart = lastFocused.selectionEnd = start + symbol.length;
      lastFocused.focus();
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Natural Deduction Proof Checker
        </Heading>
        <Text>Enter your natural deduction proof below. Each step should be on a new line, with justifications for each step.</Text>
        <HStack spacing={2}>
          {symbols.map((symbol) => (
            <Button key={symbol} onClick={() => insertSymbol(symbol)}>
              {symbol}
            </Button>
          ))}
        </HStack>
        {proofLines.map((line, index) => (
          <HStack key={index} spacing={4} align="center">
            <Text minWidth="50px">{index + 1}.</Text>
            <Input placeholder="Enter proof here..." value={line.proof} onChange={(e) => handleProofChange(index, e.target.value, "proof")} onFocus={handleFocus} size="lg" />
            <Input placeholder="Justification..." value={line.justification} onChange={(e) => handleProofChange(index, e.target.value, "justification")} onFocus={handleFocus} size="lg" />
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
