import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';

const ChatPage = () => {

  const {user} = ChatState();
  const [fetchAgain, setfetchAgain] = useState(false)
  
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box display={"flex"} justifyContent={"space-between"} 
      width={"100%"}
      height={"91.5vh"}
      padding={"10px"}
      >
        {user && <MyChats fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage
