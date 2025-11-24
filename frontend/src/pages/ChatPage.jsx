import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  const sidebarBg = useColorModeValue("gray.100", "gray.800");
  const chatBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true,
                },
              }
            : conversation
        )
      );
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      if (searchedUser._id === currentUser._id) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) =>
          conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: { text: "", sender: "" },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prev) => [...prev, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position="absolute"
      left="50%"
      w={{ base: "100%", md: "90%", lg: "900px" }}
      h="85vh"
      bg={chatBg}
      rounded="xl"
      shadow="lg"
      overflow="hidden"
      transform="translateX(-50%)"
    >
      <Flex h="full">
        {/* Sidebar */}
        <Flex
          flex={30}
          direction="column"
          bg={sidebarBg}
          p={4}
          borderRight="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Text fontWeight={700} mb={3} color={textColor}>
            Conversations
          </Text>

          <form onSubmit={handleConversationSearch}>
            <Flex align="center" gap={2} mb={4}>
              <Input
                placeholder="Search by username..."
                size="sm"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size="sm"
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          <Flex direction="column" gap={2} overflowY="auto">
            {loadingConversations
              ? [0, 1, 2, 3, 4].map((i) => (
                  <Flex key={i} gap={4} align="center" p={2}>
                    <SkeletonCircle size="10" />
                    <Flex direction="column" gap={2} flex="1">
                      <Skeleton h="10px" w="80px" />
                      <Skeleton h="8px" w="90%" />
                    </Flex>
                  </Flex>
                ))
              : conversations
    .filter((c) => c.participants && c.participants.length > 0)
    .map((conversation) => (
      <Conversation
        key={conversation._id}
        isOnline={onlineUsers.includes(conversation.participants[0]._id)}
        conversation={conversation}
      />
    ))}
          </Flex>
        </Flex>

        {/* Chat Window */}
        <Flex flex={70} direction="column" bg={chatBg}>
          {!selectedConversation._id ? (
            <Flex
              flex="1"
              align="center"
              justify="center"
              direction="column"
              color={textColor}
            >
              <GiConversation size={80} />
              <Text fontSize="lg" mt={4}>
                Select a conversation to start chatting
              </Text>
            </Flex>
          ) : (
            <MessageContainer />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatPage;



