
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text, Box, useColorModeValue } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setPosts([]);
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="70vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user && !loading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="70vh">
        <Text fontSize="2xl" color={textColor}>
          User not found
        </Text>
      </Flex>
    );
  }

  return (
    <Box maxW="700px" mx="auto" my={6} px={2}>
      {/* User Header */}
      <UserHeader user={user} />

      {/* Posts */}
      {fetchingPosts ? (
        <Flex justifyContent="center" my={12}>
          <Spinner size="xl" />
        </Flex>
      ) : posts.length === 0 ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          minH="30vh"
          bg={bgColor}
          borderRadius="lg"
          p={6}
          my={6}
          boxShadow="md"
        >
          <Text fontSize="xl" color={textColor}>
            {user.username} has not posted anything yet.
          </Text>
        </Flex>
      ) : (
        posts.map((post) => <Post key={post._id} post={post} postedBy={post.postedBy} />)
      )}
    </Box>
  );
};

export default UserPage;
