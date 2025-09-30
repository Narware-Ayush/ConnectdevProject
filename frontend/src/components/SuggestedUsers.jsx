
import { Box, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  // Theme-aware colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const skeletonStart = useColorModeValue("gray.200", "gray.600");
  const skeletonEnd = useColorModeValue("gray.300", "gray.500");

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <Box
      p={5}
      borderRadius="2xl"
      bg={cardBg}
      border="1px solid"
      borderColor={cardBorder}
      boxShadow="sm"
    >
      <Text
        mb={5}
        fontWeight="semibold"
        fontSize="lg"
        color={textColor}
        borderBottom="1px solid"
        borderColor={cardBorder}
        pb={2}
      >
        Suggested Users
      </Text>

      <Flex direction="column" gap={3}>
        {/* Render real users */}
        {!loading &&
          suggestedUsers.map((user) => (
            <Box
              key={user._id}
              p={3}
              borderRadius="lg"
              _hover={{ bg: hoverBg }}
              transition="background 0.2s"
            >
              <SuggestedUser user={user} />
            </Box>
          ))}

        {/* Loading skeletons */}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={3}
              alignItems="center"
              p={3}
              borderRadius="lg"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <SkeletonCircle size="10" startColor={skeletonStart} endColor={skeletonEnd} />
              <Flex w="full" flexDirection="column" gap={1}>
                <Skeleton h="10px" w="70px" startColor={skeletonStart} endColor={skeletonEnd} />
                <Skeleton h="10px" w="80px" startColor={skeletonStart} endColor={skeletonEnd} />
              </Flex>
              <Skeleton
                h="24px"
                w="70px"
                borderRadius="full"
                startColor={skeletonStart}
                endColor={skeletonEnd}
              />
            </Flex>
          ))}
      </Flex>
    </Box>
  );
};

export default SuggestedUsers;
