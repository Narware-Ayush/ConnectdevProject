
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
const BASE_URL = import.meta.env.VITE_API_URL;

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [inputs, setInputs] = useState({ name: "", username: "", email: "", password: "" });
	const showToast = useShowToast();

	const handleSignup = async () => {
		try {
			const res = await fetch(`${BASE_URL}/api/users/signup`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	// Theme-aware colors
	const cardBg = useColorModeValue("white", "gray.800");
	const inputBg = useColorModeValue("gray.50", "gray.700");
	const buttonBg = useColorModeValue("blue.500", "blue.400");
	const buttonHover = useColorModeValue("blue.600", "blue.500");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const cardShadow = useColorModeValue("lg", "dark-lg");

	return (
		<Flex minH="100vh" align="center" justify="center" bg={useColorModeValue("gray.50", "gray.900")} px={4}>
			<Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
				<Stack align="center">
					<Heading fontSize="4xl" textAlign="center" color={textColor}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded="2xl" bg={cardBg} boxShadow={cardShadow} p={8} w={{ base: "full", sm: "450px" }}>
					<Stack spacing={4}>
						<HStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Full Name</FormLabel>
								<Input
									bg={inputBg}
									value={inputs.name}
									onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Username</FormLabel>
								<Input
									bg={inputBg}
									value={inputs.username}
									onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
								/>
							</FormControl>
						</HStack>

						<FormControl isRequired>
							<FormLabel>Email Address</FormLabel>
							<Input
								bg={inputBg}
								type="email"
								value={inputs.email}
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									bg={inputBg}
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
								/>
								<InputRightElement h="full">
									<Button variant="ghost" onClick={() => setShowPassword((prev) => !prev)}>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>

						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								size="lg"
								bg={buttonBg}
								color="white"
								_hover={{ bg: buttonHover }}
								onClick={handleSignup}
								borderRadius="xl"
								boxShadow="md"
							>
								Sign up
							</Button>
						</Stack>

						<Stack pt={6}>
							<Text align="center" color={textColor}>
								Already a user?{" "}
								<Link color="blue.400" onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
