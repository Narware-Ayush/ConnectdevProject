
import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
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

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({ username: "", password: "" });
	const showToast = useShowToast();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${BASE_URL}/api/users/login`, {
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
		} finally {
			setLoading(false);
		}
	};

	const cardBg = useColorModeValue("white", "gray.800");
	const cardShadow = useColorModeValue("lg", "dark-lg");
	const inputBg = useColorModeValue("gray.50", "gray.700");
	const buttonBg = useColorModeValue("blue.500", "blue.400");
	const buttonHover = useColorModeValue("blue.600", "blue.500");
	const textColor = useColorModeValue("gray.800", "gray.100");

	return (
		<Flex minH="100vh" align="center" justify="center" bg={useColorModeValue("gray.50", "gray.900")} px={4}>
			<Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
				<Stack align="center">
					<Heading fontSize="4xl" textAlign="center" color={textColor}>
						Login
					</Heading>
				</Stack>
				<Box rounded="2xl" bg={cardBg} boxShadow={cardShadow} p={8} w={{ base: "full", sm: "400px" }}>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								bg={inputBg}
								value={inputs.username}
								onChange={(e) => setInputs((prev) => ({ ...prev, username: e.target.value }))}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									bg={inputBg}
									value={inputs.password}
									onChange={(e) => setInputs((prev) => ({ ...prev, password: e.target.value }))}
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
								loadingText="Logging in"
								size="lg"
								bg={buttonBg}
								color="white"
								_hover={{ bg: buttonHover }}
								onClick={handleLogin}
								isLoading={loading}
								borderRadius="xl"
								boxShadow="md"
							>
								Login
							</Button>
						</Stack>

						<Stack pt={6}>
							<Text align="center" color={textColor}>
								Don&apos;t have an account?{" "}
								<Link color="blue.400" onClick={() => setAuthScreen("signup")}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
