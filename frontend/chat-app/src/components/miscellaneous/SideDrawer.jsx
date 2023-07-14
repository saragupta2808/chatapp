import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBell } from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import ChatLoading from './ChatLoading';
import axios from '../../axios'
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge'
import Effect from 'react-notification-badge';
const SideDrawer = () => {
    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState(false)
    const {user, setselectedChat,chats,setChats, notification, setnotification} = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const history = useHistory();
    const toast = useToast();
    const logoutHandler = ()=>{
        localStorage.removeItem("userInfo");
        history.push("/")
    }
    const accessChat=async (userId)=>{
        try {
            setloadingChat(true);
            const config ={
                headers: {
                    "Content-type":"application/json",
                    "Authorization":`Bearer ${user.token}`
                }
            }
            const {data} = await axios.post('/api/chat/', {userId}, config);
            if(!chats.find((c) => c._id === data._id))
                setChats([data, ...chats])
            setselectedChat(data)
            setloadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Error fetching chat',
                description:error.message,
                status: 'error',
                duration: 4000,
                isClosable: true,
                position:'bottom-left'
            })
        }
    }
    const handleSearch=async()=>{
        if(!search){
            toast({
                title: 'Please enter something in search',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position:'top-left'
            })
        }
    
        try {
            setloading(true);
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${search}`, config)
            setloading(false);
            setsearchResult(data)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description:'Failed to load search results',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position:'bottom-left'
            })
        }
    }
  return (
    
    <>
    <Box
     display={"flex"}
     justifyContent={"space-between"}
     alignItems={"center"}
     bg="white"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth={"5px"}>
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
        <Button variant='ghost' onClick={onOpen}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
         <Text display={{base: "none", md:"flex"}} px="4">Search User</Text>
        </Button>
        </Tooltip>


        <Text fontSize={"2xl"} fontFamily={"Work sans"}>Talk-A-Tive</Text>

        <div>
            <Menu>
                <MenuButton p={"1"}>
                <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}/>
                <FontAwesomeIcon icon={faBell} size="xl" style={{color: "#020812",marginTop:"5px"}} />
                </MenuButton>
                <MenuList pl={2}>
                    {/* notifications */}
                    {!notification.length && "No New Messages"}
                    {
                        notification.map(notif => {
                            return(
                                <MenuItem key={notif._id} onClick={()=> {setselectedChat(notif.chat); setnotification(notification.filter((n)=> n !== notif))}}>
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`: `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Menu>

            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
                    <Avatar size="sm" cursor={'pointer'} name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                   
                    <MenuDivider/> 
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>


    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
            <DrawerBody>
                <Box display={'flex'} pb={2}>
                    <Input
                    placeholder='Serach by name or email'
                    mr={2}
                    value={search}
                    onChange={(e)=> setsearch(e.target.value)}/>
                    <Button onClick={handleSearch}>Go</Button>
                </Box>

                {loading ? (
                    <ChatLoading/>
                ):(
                    searchResult?.map(user=>(
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={()=> accessChat(user._id)}/>
                    ))
                  
                )}
                {loadingChat && <Spinner ml='auto' display={'flex'}/>}
            </DrawerBody>
        </DrawerContent>
        
    </Drawer>
    </>
  )
}

export default SideDrawer
