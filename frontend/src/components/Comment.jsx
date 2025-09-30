// import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// const Comment = ({ reply, lastReply }) => {
// 	return (
// 		<>
// 			<Flex gap={4} py={2} my={2} w={"full"}>
// 				<Avatar src={reply.userProfilePic} size={"sm"} />
// 				<Flex gap={1} w={"full"} flexDirection={"column"}>
// 					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
// 						<Text fontSize='sm' fontWeight='bold'>
// 							{reply.username}
// 						</Text>
// 					</Flex>
// 					<Text>{reply.text}</Text>
// 				</Flex>
// 			</Flex>
// 			{!lastReply ? <Divider /> : null}
// 		</>
// 	);
// };

// export default Comment;

import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ reply, lastReply }) => {
	const bg = useColorModeValue("rgba(255,255,255,0.85)", "rgba(30,30,30,0.7)");
	const textColor = useColorModeValue("gray.800", "gray.200");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	return (
		<Box
			my={2}
			p={3}
			bg={bg}
			borderRadius="2xl"
			border="1px solid"
			borderColor={borderColor}
			boxShadow="0 4px 12px rgba(0,0,0,0.1)"
			backdropFilter="blur(10px)"
			_hover={{ transform: "translateY(-2px)", shadow: "lg" }}
			transition="0.25s"
		>
			<Flex gap={4} w="full">
				<Avatar
					src={reply.userProfilePic}
					size="sm"
					border="2px solid"
					borderColor="blue.400"
				/>
				<Flex w="full" flexDirection="column">
					<Flex justifyContent="space-between" alignItems="center">
						<Text fontSize="sm" fontWeight="bold" color={textColor}>
							{reply.username}
						</Text>
						{reply.createdAt && (
							<Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
								{formatDistanceToNow(new Date(reply.createdAt))} ago
							</Text>
						)}
					</Flex>
					<Text fontSize="sm" color={textColor} mt={1}>
						{reply.text}
					</Text>
				</Flex>
			</Flex>
			{!lastReply && (
				<Box
					h="1px"
					bg={useColorModeValue("gray.200", "gray.600")}
					mt={3}
					w="full"
					borderRadius="full"
				/>
			)}
		</Box>
	);
};

export default Comment;

