
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setPostText(inputText.slice(0, MAX_CHAR));
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      if (username === user.username) setPosts([data, ...posts]);
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Create Post Button */}
      <Button
        position="fixed"
        bottom={10}
        right={5}
        bgGradient="linear(to-r, teal.400, blue.500)"
        color="white"
        rounded="full"
        shadow="lg"
        size={{ base: "sm", sm: "md" }}
        _hover={{ transform: "scale(1.05)", shadow: "xl" }}
        transition="all 0.2s"
        onClick={onOpen}
      >
        <AddIcon />
      </Button>

      {/* Modal for Post Creation */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent
          bg={bg}
          borderRadius="2xl"
          shadow="2xl"
          overflow="hidden"
        >
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            Create New Post
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControl>
              {/* Post Text */}
              <Textarea
                placeholder="What's on your mind?"
                resize="none"
                rows={4}
                value={postText}
                onChange={handleTextChange}
                borderRadius="lg"
                focusBorderColor="blue.400"
              />
              <Flex justify="space-between" mt={2} align="center">
                <BsFillImageFill
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => imageRef.current.click()}
                  color={useColorModeValue("#4A5568", "#CBD5E0")}
                />
                <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                  {remainingChar}/{MAX_CHAR}
                </Text>
              </Flex>
              <Input
                type="file"
                hidden
                ref={imageRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormControl>

            {/* Image Preview */}
            {imgUrl && (
              <Box mt={4} position="relative" rounded="lg" overflow="hidden">
                <Image src={imgUrl} alt="preview" borderRadius="lg" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  position="absolute"
                  top={2}
                  right={2}
                  bg="blackAlpha.600"
                  color="white"
                  _hover={{ bg: "blackAlpha.800" }}
                />
              </Box>
            )}
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
              borderRadius="full"
              px={6}
            >
              Post
            </Button>
            <Button onClick={onClose} variant="ghost" borderRadius="full">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
