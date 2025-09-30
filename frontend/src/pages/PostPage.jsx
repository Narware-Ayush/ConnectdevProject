import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent="center" mt={10}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!currentPost) return null;

  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box maxW="700px" mx="auto" my={6} px={2}>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Flex gap={3} alignItems="center">
          <Avatar src={user.profilePic} name={user.username} />
          <Box>
            <Text fontWeight="bold" color={textColor}>
              {user.username}
            </Text>
            <Text fontSize="sm" color={secondaryText}>
              {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>
          </Box>
        </Flex>
        {currentUser?._id === user._id && (
          <DeleteIcon
            cursor="pointer"
            color="red.400"
            _hover={{ color: "red.600" }}
            onClick={handleDeletePost}
          />
        )}
      </Flex>

      {/* Post Content */}
      <Text fontSize="md" color={textColor} mb={3} lineHeight="1.6">
        {currentPost.text}
      </Text>

      {currentPost.img && (
        <Box borderRadius="md" overflow="hidden" border={`1px solid ${borderColor}`} mb={3}>
          <Image src={currentPost.img} w="full" />
        </Box>
      )}

      {/* Actions */}
      <Flex mb={4}>
        <Actions post={currentPost} />
      </Flex>

      <Divider mb={4} />

      {/* App Promo */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Flex gap={2} alignItems="center">
          <Text fontSize="2xl">👋</Text>
          <Text color={secondaryText}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button size="sm" colorScheme="blue">
          Get
        </Button>
      </Flex>

      <Divider mb={4} />

      {/* Comments */}
      <Box>
        {currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PostPage;

