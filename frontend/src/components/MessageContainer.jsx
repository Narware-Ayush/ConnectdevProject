
import {
	Avatar,
	Divider,
	Flex,
	Image,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);
	const { socket } = useSocket();
	const setConversations = useSetRecoilState(conversationsAtom);
	const messageEndRef = useRef(null);

	const bgColor = useColorModeValue("gray.100", "gray.800");
	const messageBg = useColorModeValue("white", "gray.700");
	const ownMessageBg = useColorModeValue("blue.100", "blue.600");

	useEffect(() => {
		if (!socket) return;

		socket.on("newMessage", (message) => {
			if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}

			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

			setConversations((prev) =>
				prev.map((conversation) =>
					conversation._id === message.conversationId
						? {
								...conversation,
								lastMessage: { text: message.text, sender: message.sender },
						  }
						: conversation
				)
			);
		});

		return () => socket && socket.off && socket.off("newMessage");
	}, [socket, selectedConversation, setConversations]);

	useEffect(() => {
		const lastMessageIsFromOtherUser =
			messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser && socket && socket.emit) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		if (socket && socket.on) {
			socket.on("messagesSeen", ({ conversationId }) => {
				if (selectedConversation._id === conversationId) {
					setMessages((prev) =>
						prev.map((message) => ({ ...message, seen: true }))
					);
				}
			});
		}
	}, [socket, currentUser._id, messages, selectedConversation]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	return (
		<Flex
			flex="70"
			flexDirection="column"
			bg={bgColor}
			borderRadius="md"
			p={2}
			h="full"
		>
			{/* Header */}
			<Flex
				w="full"
				h={16}
				alignItems="center"
				gap={3}
				px={4}
				borderBottom="1px solid"
				borderColor={useColorModeValue("gray.300", "gray.600")}
				flexShrink={0}
			>
				<Avatar src={selectedConversation.userProfilePic} size="md" />
				<Text fontWeight="600" fontSize="md" display="flex" alignItems="center">
					{selectedConversation.username}
					<Image src="/verified.png" w={4} h={4} ml={1} />
				</Text>
			</Flex>

			{/* Messages */}
			<Flex
				flexDir="column"
				flex="1"
				p={4}
				gap={3}
				overflowY="auto"
				scrollBehavior="smooth"
				sx={{
					"&::-webkit-scrollbar": { width: "6px" },
					"&::-webkit-scrollbar-thumb": {
						background: useColorModeValue("gray.400", "gray.600"),
						borderRadius: "3px",
					},
				}}
			>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems="center"
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size="8" />}
							<Flex flexDir="column" gap={2}>
								<Skeleton h="10px" w="200px" borderRadius="md" />
								<Skeleton h="10px" w="150px" borderRadius="md" />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size="8" />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
							justify={currentUser._id === message.sender ? "flex-end" : "flex-start"}
						>
							<Message
								message={message}
								ownMessage={currentUser._id === message.sender}
								bg={currentUser._id === message.sender ? ownMessageBg : messageBg}
							/>
						</Flex>
					))}
			</Flex>

			{/* Message input */}
			<MessageInput setMessages={setMessages} />
		</Flex>
	);
};

export default MessageContainer;
