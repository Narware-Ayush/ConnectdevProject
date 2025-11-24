
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
const BASE_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  const emptyTextColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch(`${BASE_URL}/api/posts/feed`,{
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex
      gap={10}
      alignItems="flex-start"
      justify="center"
      px={{ base: 4, md: 10 }}
      py={6}
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      {/* Main Feed */}
      <Box flex={{ base: "100%", md: 70 }} maxW={{ md: "650px" }}>
        {loading && (
          <Flex justify="center" py={20}>
            <Spinner size="xl" />
          </Flex>
        )}

        {!loading && posts.length === 0 && (
          <Text fontSize="lg" fontWeight="semibold" color={emptyTextColor} py={10} textAlign="center">
            Follow some users to see their posts in your feed
          </Text>
        )}

        {!loading &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>

      {/* Sidebar: Suggested Users */}
      <Box
        flex={{ base: "100%", md: 30 }}
        display={{ base: "none", md: "block" }}
        maxW={{ md: "350px" }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
