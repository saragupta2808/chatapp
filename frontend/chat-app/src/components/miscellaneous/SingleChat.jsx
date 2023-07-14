import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from '../../axios';
import io from 'socket.io-client'
import './styles.css'
import Lottie from 'lottie-react'
import typingAnimation from '../../assets/typingAnimation.json'
import ScrollableChat from './ScrollableChat';
const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare;
const SingleChat = ({fetchAgain, setfetchAgain}) => {
    const {user, selectedChat, setselectedChat, notification, setnotification} = ChatState();
    const [messages, setmessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setnewMessage] = useState('')
    const [socketConnected, setsocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)


    const defaultOptions ={
        loop: true,
        autoplay: true,
        animationData: typingAnimation,
        rendererSettings:{
            preserveAspectRatio : 'xMidYMid slice'
        }

    }

    const toast = useToast();
    useEffect(() => {
        socket = io(ENDPOINT)  
        socket.emit('setup', user);
        socket.on('Connected',()=>{
            setsocketConnected(true)
        })
        socket.on('typing', ()=> setisTyping(true));
        socket.on('stop typing', ()=> setisTyping(false));
    }, [])
    useEffect(() => {
      fetchMessages();

      //making our messages real time
      selectedChatCompare = selectedChat;

    }, [selectedChat])

    // console.log('Notification----' , notification)

    useEffect(() => {
        socket.on('message received', (newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                //give notification
                if(!notification.includes(newMessageReceived)){
                    setnotification([newMessageReceived, ...notification]);
                    setfetchAgain(!fetchAgain) 
                }

            }
            else{
                setmessages([...messages, newMessageReceived])
            }
        })
    })
    

      
    
    const fetchMessages = async()=>{
        if(!selectedChat)
            return;
        try {
            const config = {
                headers:{
                    'Authorization':`Bearer ${user.token}`
                }
            }
            setloading(true);
            const {data} = await axios.get(`/api/message/${selectedChat._id}`,config)
            // console.log(data)
            setmessages(data);
            setloading(false)

            socket.emit("join chat", selectedChat._id)
            
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-left",
              });
        }
    }
    const sendMessage=async (event)=>{
        if(event.key === 'Enter' && newMessage){
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${user.token}`
                    }
                }
                setnewMessage('');
                const {data} = await axios.post('/api/message',{
                    content: newMessage,
                    chatId: selectedChat._id
                },config)

                console.log(data)
                
                //sending message to socket.io ('new message')
                socket.emit('new message',data)
                
                setmessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error occured!",
                    description: error.message,
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-left",
                  });
            }
        }
    }
    const typingHandler=(e)=>{
        setnewMessage(e.target.value);
        // typing Indicator logic

        if(!socketConnected)
            return;
        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

   
  return (
    <>
    {
        selectedChat? (
            <>
                <Text
                fontSize={{'base':"28px", md:'30px'}}
                pb={3}
                px={2}
                display={'flex'}
                justifyContent={{'base':'space-between'}}
                alignItems={'center'}
                w={'100%'}
                fontFamily={'Work sans'}>

                    <IconButton display={{'base':'flex', md:'none'}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=> setselectedChat("")}/>

                    {!selectedChat.isGroupChat ? (
                    <>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                    </>
                    ):(
                    <>
                        {selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setfetchAgain={setfetchAgain}
                        fetchMessages={fetchMessages}/>

                    </>)}



                </Text>

                <Box
                display={'flex'}
                flexDir={'column'}
                justifyContent={'flex-end'}
                p={3}
                bg={'#e8e8e8'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}>
                    {/* Messages here */}

                    {loading ? (<Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'}/>):
                    (   
                    
                      <div className="messages">
                        
                        <ScrollableChat messages={messages}/>
                      </div>
                    )}

                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div> <Lottie  style={{marginBottom: 15, marginLeft:0, width:70}} animationData={typingAnimation} loop={true}/> </div>: <></>}
                        <Input variant={'filled'} bg={'#e0e0e0'} placeholder='Enter a message...' onChange={typingHandler}
                        value={newMessage}/>
                    </FormControl>
                </Box>
            </>
        ):(
            <>
                <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                h='100%'>
                    <Text fontSize='3xl' pb={3} fontFamily='Work sans'>Click on a user to start chatting...</Text>
                </Box>
            </>
        )
    }
    </>
  )
}

export default SingleChat
