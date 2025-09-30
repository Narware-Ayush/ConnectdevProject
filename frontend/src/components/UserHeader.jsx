
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useColorModeValue, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success",
				status: "success",
				description: "Profile link copied",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const subTextColor = useColorModeValue("gray.500", "gray.400");
	const buttonBg = useColorModeValue("blue.500", "blue.400");
	const buttonHover = useColorModeValue("blue.600", "blue.500");

	return (
		<VStack
			gap={4}
			align="start"
			w="full"
			bg={useColorModeValue("white", "gray.800")}
			p={6}
			borderRadius="2xl"
			boxShadow="md"
		>
			{/* Name + Avatar */}
			<Flex justify="space-between" w="full" align="center">
				<Box>
					<Text fontSize="2xl" fontWeight="bold" color={textColor}>
						{user.name}
					</Text>
					<Flex gap={2} align="center">
						<Text fontSize="sm" color={subTextColor}>
							@{user.username}
						</Text>
						<Text
							fontSize="xs"
							bg={useColorModeValue("gray.200", "gray.700")}
							color={textColor}
							p={1}
							borderRadius="full"
						>
							Its,me
						</Text>
					</Flex>
				</Box>

				<Avatar
					name={user.name}
					src={user.profilePic || "https://bit.ly/broken-link"}
					size={{ base: "md", md: "xl" }}
					border="2px solid"
					borderColor={buttonBg}
				/>
			</Flex>

			{/* Bio */}
			<Text color={textColor}>{user.bio || "No bio available"}</Text>

			{/* Follow/Update button */}
			{currentUser?._id === user._id ? (
				<Link as={RouterLink} to="/update">
					<Button size="sm" bg={buttonBg} color="white" _hover={{ bg: buttonHover }}>
						Update Profile
					</Button>
				</Link>
			) : (
				<Button
					size="sm"
					onClick={handleFollowUnfollow}
					isLoading={updating}
					bg={buttonBg}
					color="white"
					_hover={{ bg: buttonHover }}
				>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			{/* Followers + Instagram + Copy */}
			<Flex w="full" justify="space-between" align="center">
				<Flex gap={3} align="center">
					<Text color={subTextColor}>{user.followers.length} connections</Text>
					<Box w="1" h="1" bg={subTextColor} borderRadius="full"></Box>
					<Link color="blue.400" href={`https://linkedin.com`} isExternal>
						Linkedin.com
					</Link>
				</Flex>

				<Flex gap={3}>
					
					<Menu>
						<MenuButton>
							<CgMoreO size={24} cursor="pointer" />
						</MenuButton>
						<Portal>
							<MenuList bg={useColorModeValue("white", "gray.800")}>
								<MenuItem onClick={copyURL}>Copy link</MenuItem>
							</MenuList>
						</Portal>
					</Menu>
				</Flex>
			</Flex>

			{/* Tabs */}
			<Flex w="full">
				<Flex
					flex={1}
					borderBottom="2px solid"
					borderColor={buttonBg}
					justify="center"
					pb={3}
					cursor="pointer"
				>
					<Text fontWeight="bold" color={textColor}>
						Threads
					</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom="1px solid"
					borderColor={borderColor}
					justify="center"
					pb={3}
					cursor="pointer"
				>
					<Text fontWeight="bold" color={subTextColor}>
						Replies
					</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;

