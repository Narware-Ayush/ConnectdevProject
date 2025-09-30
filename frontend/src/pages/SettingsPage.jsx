import { Box, Button, Flex, Stack, Text, useColorModeValue, Heading } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();

			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const cardBg = useColorModeValue("rgba(255,255,255,0.85)", "rgba(30,30,30,0.75)");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	return (
		<Flex justify="center" align="center" py={8}>
			<Box
				w="full"
				maxW="md"
				p={6}
				bg={cardBg}
				rounded="2xl"
				border="1px solid"
				borderColor={borderColor}
				boxShadow="0 8px 24px rgba(0,0,0,0.2)"
				backdropFilter="blur(12px)"
			>
				<Stack spacing={6}>
					<Heading size="lg" textAlign="center">
						Account Settings
					</Heading>
					<Stack spacing={2}>
						<Text fontWeight="bold">Freeze Your Account</Text>
						<Text color={useColorModeValue("gray.700", "gray.300")}>
							You can unfreeze your account anytime by logging in.
						</Text>
					</Stack>
					<Button
						colorScheme="red"
						size="md"
						w="full"
						onClick={freezeAccount}
						_hover={{ transform: "scale(1.03)" }}
						transition="0.2s"
					>
						Freeze Account
					</Button>
				</Stack>
			</Box>
		</Flex>
	);
};

