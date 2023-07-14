import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import axios from '../../axios'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
const GroupChatModal = ({children}) => {
const { isOpen, onOpen, onClose } = useDisclosure()
const [groupChatName, setgroupChatName] = useState()
const [selectedUsers, setselectedUsers] = useState([])
const [search, setsearch] = useState()
const [searchResult, setsearchResult] = useState()
const [loading, setloading] = useState(false)
const toast = useToast();
const {user,chats,setChats} = ChatState()

const handleDelete = (delUser)=>{
    setselectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
}
const handleGroup=(userToAdd)=>{
    if(selectedUsers.includes(userToAdd)){
        toast({
            title: 'User already added',
            status: 'warning',
            duration: 4000,
            isClosable: true,
            position:'top'
        })
        return;

    }

    setselectedUsers([...selectedUsers, userToAdd])
}
const handleSearch = async(query)=>{
    setsearch(query);
    if(!query){
        return;
    }

    try {
        setloading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }

        const {data} = await axios.get(`/api/user?search=${search}`,config);
        console.log(data)
        setloading(false);
        setsearchResult(data)
    } catch (error) {
        // console.log(error)
        toast({
            title: 'Error occured!',
            description:'Failed to load search results',
            status: 'error',
            duration: 4000,
            isClosable: true,
            position:'bottom-left'
        })
        setloading(false)
    }
}
const handleSubmit = async()=>{
    if(!groupChatName || !selectedUsers){
        toast({
            title: 'Please fill all the fields',
            status: 'warning',
            duration: 4000,
            isClosable: true,
            position:'top'
        })
        return;
    }
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data} = await axios.post('/api/chat/group', {
            name:groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=> u._id)),

        },config)
        setChats([data, ...chats])
        onClose();
        toast({
            title: 'New Group Chat Created',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position:'top'
        })

    } catch (error) {
        toast({
            title: 'Failed to create group!',
            description:error.response.data,
            status: 'error',
            duration: 4000,
            isClosable: true,
            position:'top'
        })
    }
}

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={'35px'}
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={'center'}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDir={'column'}
          alignItems={'center'}>
            <FormControl>
                <Input placeholder='Chat Name' mb={3}
                onChange={(e)=> setgroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder='Add Users eg: John, Piyush' mb={3}
                onChange={(e)=> handleSearch(e.target.value)}/>
            </FormControl>
            {/* selected users */}
            <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
            {selectedUsers.map(u => (
                <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=> handleDelete(u)}/>
            ))}
            </Box>
            
            {/* render searched users */}
            {loading ? <div>loading...</div>:(
                searchResult?.slice(0,4).map(user=>(
                    <UserListItem key={user._id}
                    user={user}
                    handleFunction={()=>handleGroup(user)}/>
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Group
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
