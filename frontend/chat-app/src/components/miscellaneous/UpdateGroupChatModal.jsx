import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "../../axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setfetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setselectedChat, user } = ChatState();
  const [groupChatName, setgroupChatName] = useState();
  const [search, setsearch] = useState();
  const [searchResult, setsearchResult] = useState();
  const [loading, setloading] = useState(false);
  const [renameLoading, setrenameLoading] = useState(false);
  const toast = useToast();
  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
            title: "Only admins can remove someone",
            status: "warning",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    try {
        setloading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        const {data} = await axios.put('/api/chat/groupremove',{
            chatId: selectedChat._id,
            userId: user1._id
        }, config)

        user._id === user1._id ? setselectedChat() : setselectedChat(data);
        setfetchAgain(!fetchAgain);
        fetchMessages();
        setloading(false);
        
    } catch (error) {
        toast({
            title: "Error occured!",
            description: error.message,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
        setloading(false)
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setrenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setselectedChat(data);
      setfetchAgain(!fetchAgain);
      setrenameLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      setrenameLoading(false);
    }

    setgroupChatName("");
  };
  const handleSearch = async (query) => {
    setsearch(query);
    if (!query) {
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setloading(false);
      setsearchResult(data);
    } catch (error) {
      // console.log(error)
      toast({
        title: "Error occured!",
        description: "Failed to load search results",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false)
    }
  };
  const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=> u._id === user1._id)){
        toast({
            title: "User already in group!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
        })
        return;
    }
    if(selectedChat.groupAdmin._id !== user1.id){
        toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
        })
        return;
    }

    try {
        setloading(true)
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        const {data} = await axios.put('/api/chat/groupadd',{
            chatId: selectedChat._id,
            userId: user1._id
        }, config)
        setselectedChat(data)
        setfetchAgain(!fetchAgain)
        setloading(false);
    } catch (error) {
        toast({
            title: "Error occured!",
            description: error.message,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          });
          setloading(false)
    }


  }
  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} pb={3} flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setgroupChatName(e.target.value)}
              />

              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
               
                <Spinner size={'lg'}/>
            
            ):(searchResult?.map((user)=>(
               <UserListItem
               key={user._id}
               user={user}
               handleFunction={()=> handleAddUser(user)}/>
            ))
           )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
