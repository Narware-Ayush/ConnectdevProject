
import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  // Theme-aware colors
  const cardBg = useColorModeValue("whiteAlpha.900", "blackAlpha.700");
  const cardHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const avatarBorder = useColorModeValue("blue.400", "blue.300");
  const replyBorder = useColorModeValue("gray.200", "gray.800");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex
        gap={4}
        mb={8}
        py={6}
        px={5}
        bg={cardBg}
        _hover={{ bg: cardHoverBg, transform: "translateY(-2px)" }}
        transition="all 0.25s ease-in-out"
        borderRadius="2xl"
        boxShadow="0px 6px 20px rgba(0,0,0,0.15)"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(8px)"
      >
        {/* Left Side (Avatar + Thread) */}
        <Flex flexDirection="column" alignItems="center" minW="60px">
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            cursor="pointer"
            border="2px solid"
            borderColor={avatarBorder}
            _hover={{ transform: "scale(1.12) rotate(2deg)", borderColor: avatarBorder }}
            transition="all 0.3s"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" flex={1} bg={borderColor} my={2}></Box>

          <Box position="relative" w="full">
            {post.replies.length === 0 && <Text fontSize="xs" textAlign="center">🥱</Text>}
            {post.replies.slice(0, 3).map((reply, i) => (
              <Avatar
                key={i}
                size="xs"
                src={reply.userProfilePic}
                position="absolute"
                border="2px solid"
                borderColor={replyBorder}
                boxShadow="md"
                {...(i === 0
                  ? { top: "0px", left: "15px" }
                  : i === 1
                  ? { bottom: "0px", right: "-5px" }
                  : { bottom: "0px", left: "4px" })}
              />
            ))}
          </Box>
        </Flex>

        {/* Right Side (Content) */}
        <Flex flex={1} flexDirection="column" gap={3}>
          {/* Username + Date */}
          <Flex justifyContent="space-between" alignItems="center" w="full">
            <Flex alignItems="center" gap={2}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                cursor="pointer"
                _hover={{ color: "blue.400" }}
                color={textColor}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} />
            </Flex>
            <Flex gap={3} alignItems="center">
              <Text fontSize="xs" color={secondaryText}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <DeleteIcon
                  boxSize={4}
                  cursor="pointer"
                  color="red.400"
                  _hover={{ color: "red.600", transform: "scale(1.15)" }}
                  transition="0.2s"
                  onClick={handleDeletePost}
                />
              )}
            </Flex>
          </Flex>

          {/* Post Text */}
          <Text fontSize="md" color={textColor} lineHeight="1.6">
            {post.text}
          </Text>

          {/* Post Image */}
          {post.img && (
            <Box
              borderRadius="xl"
              overflow="hidden"
              border="1px solid"
              borderColor={borderColor}
              shadow="lg"
              _hover={{ transform: "scale(1.01)" }}
              transition="0.25s"
            >
              <Image src={post.img} w="full" />
            </Box>
          )}

          {/* Actions */}
          <Flex gap={6} mt={2} alignItems="center">
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
