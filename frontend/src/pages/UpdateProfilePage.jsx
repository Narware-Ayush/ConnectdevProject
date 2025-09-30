
import {
	Flex,
	Box,
	Stack,
	FormControl,
	FormLabel,
	Input,
	Button,
	Heading,
	Avatar,
	Center,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);

	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	const cardBg = useColorModeValue(
		"rgba(255,255,255,0.85)",
		"rgba(30,30,30,0.75)"
	);
	const borderColor = useColorModeValue("gray.200", "gray.700");

	return (
		<form onSubmit={handleSubmit}>
			<Flex align="center" justify="center" my={8}>
				<Box
					w="full"
					maxW="md"
					p={8}
					bg={cardBg}
					rounded="2xl"
					boxShadow="0 8px 24px rgba(0,0,0,0.2)"
					backdropFilter="blur(12px)"
					border="1px solid"
					borderColor={borderColor}
				>
					<Stack spacing={6}>
						<Heading textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
							Update Profile
						</Heading>

						<FormControl>
							<Stack direction={["column", "row"]} spacing={6} align="center">
								<Center>
									<Avatar
										size="xl"
										src={imgUrl || user.profilePic}
										boxShadow="md"
									/>
								</Center>
								<Center w="full">
									<Button
										w="full"
										colorScheme="blue"
										variant="outline"
										onClick={() => fileRef.current.click()}
									>
										Change Avatar
									</Button>
									<Input
										type="file"
										hidden
										ref={fileRef}
										onChange={handleImageChange}
									/>
								</Center>
							</Stack>
						</FormControl>

						<FormControl>
							<FormLabel>Full Name</FormLabel>
							<Input
								placeholder="John Doe"
								value={inputs.name}
								onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input
								placeholder="johndoe"
								value={inputs.username}
								onChange={(e) =>
									setInputs({ ...inputs, username: e.target.value })
								}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input
								placeholder="email@example.com"
								value={inputs.email}
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Bio</FormLabel>
							<Input
								placeholder="Your bio..."
								value={inputs.bio}
								onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input
								placeholder="Leave empty to keep current password"
								value={inputs.password}
								onChange={(e) =>
									setInputs({ ...inputs, password: e.target.value })
								}
								type="password"
							/>
						</FormControl>

						<Stack direction={["column", "row"]} spacing={4}>
							<Button
								w="full"
								colorScheme="red"
								variant="outline"
								onClick={() => {
									setInputs({
										name: user.name,
										username: user.username,
										email: user.email,
										bio: user.bio,
										password: "",
									});
								}}
							>
								Cancel
							</Button>
							<Button
								w="full"
								colorScheme="green"
								type="submit"
								isLoading={updating}
							>
								Submit
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Flex>
		</form>
	);
}
