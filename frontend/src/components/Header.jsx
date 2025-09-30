
import {
	Box,
	Flex,
	Image,
	Link,
	IconButton,
	Tooltip,
	useColorMode,
	Button,
	Container,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authAtom";
import useLogout from "../hooks/useLogout";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Box
			as="header"
			shadow="sm"
			borderBottom="1px solid"
			borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
			bg={colorMode === "dark" ? "gray.900" : "white"}
			position="sticky"
			top="0"
			zIndex="1000"
			py={2}
		>
			<Container maxW="6xl"> {/* ~90% of screen width */}
				<Flex justifyContent="space-between" alignItems="center">
					
					{/* Left */}
					<Flex alignItems="center" gap={4}>
						{user ? (
							<Tooltip label="Home" placement="bottom">
								<Link as={RouterLink} to="/">
									<AiFillHome size={24} cursor="pointer" />
								</Link>
							</Tooltip>
						) : (
							<Button
								size="sm"
								variant="outline"
								colorScheme="blue"
								onClick={() => setAuthScreen("login")}
								as={RouterLink}
								to="/auth"
							>
								Login
							</Button>
						)}
					</Flex>

					{/* Center logo */}
					<Image
						cursor="pointer"
						alt="logo"
						w={7}
						src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
						onClick={toggleColorMode}
						transition="transform 0.2s ease"
						_hover={{ transform: "rotate(15deg) scale(1.1)" }}
					/>

					{/* Right */}
					<Flex alignItems="center" gap={4}>
						{user ? (
							<>
								<Tooltip label="Profile" placement="bottom">
									<Link as={RouterLink} to={`/${user.username}`}>
										<RxAvatar size={24} cursor="pointer" />
									</Link>
								</Tooltip>

								<Tooltip label="Chat" placement="bottom">
									<Link as={RouterLink} to="/chat">
										<BsFillChatQuoteFill size={20} cursor="pointer" />
									</Link>
								</Tooltip>

								<Tooltip label="Settings" placement="bottom">
									<Link as={RouterLink} to="/settings">
										<MdOutlineSettings size={22} cursor="pointer" />
									</Link>
								</Tooltip>

								<Tooltip label="Logout" placement="bottom">
									<IconButton
										icon={<FiLogOut size={18} />}
										aria-label="Logout"
										onClick={logout}
										variant="ghost"
										colorScheme="red"
										size="sm"
										isRound
									/>
								</Tooltip>
							</>
						) : (
							<Button
								size="sm"
								variant="solid"
								colorScheme="blue"
								as={RouterLink}
								to="/auth"
								onClick={() => setAuthScreen("signup")}
							>
								Sign up
							</Button>
						)}
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
};

export default Header;

