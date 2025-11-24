import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorModeValue,
	Tooltip,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage;
	const [selectedConversation, setSelectedConversation] = useRecoilState(
		selectedConversationAtom
	);

	// Theme-aware colors
	const selectedBg = useColorModeValue("gray.300", "gray.600");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const subTextColor = useColorModeValue("gray.600", "gray.400");

	return (
		
		<Flex
			gap={4}
			alignItems="center"
			p={{ base: 2, md: 3 }}
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			bg={
				selectedConversation?._id === conversation._id ? selectedBg : "transparent"
			}
			borderRadius="lg"
			border="none"
		>

			
			<WrapItem>
				<Avatar
					size={{ base: "sm", md: "md" }}
					src={user.profilePic}
					name={user.username}
				>
					{isOnline && (
						<AvatarBadge
							boxSize="1em"
							bg="green.400"
							border="none"
						/>
					)}
				</Avatar>
			</WrapItem>

			

			<Stack spacing={0.5} flex="1" minW={0}>
				<Text
					fontWeight="600"
					color={textColor}
					display="flex"
					alignItems="center"
					fontSize={{ base: "sm", md: "md" }}
					isTruncated
				>
					{user.username}
					<Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>

				<Flex
					fontSize="xs"
					alignItems="center"
					gap={1}
					color={subTextColor}
					minW={0}
				>
					{currentUser._id === lastMessage.sender && (
						<Box color={lastMessage.seen ? "blue.400" : "gray.400"}>
							<BsCheck2All size={14} />
						</Box>
					)}

					<Tooltip
						label={lastMessage.text || "Image"}
						hasArrow
						placement="top-start"
						fontSize="sm"
					>
						<Text noOfLines={1} wordBreak="break-word">
							{lastMessage.text ? (
								lastMessage.text
							) : (
								<BsFillImageFill size={14} />
							)}
						</Text>
					</Tooltip>
				</Flex>
			</Stack>
		</Flex>
	);
};

export default Conversation;




