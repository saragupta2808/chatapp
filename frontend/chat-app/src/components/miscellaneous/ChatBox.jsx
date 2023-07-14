import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setfetchAgain}) => {
  const {selectedChat}= ChatState();

  return (
    <Box display={{base: selectedChat ? 'flex': 'none' , md: 'flex'}}
    width={{base: '100%', md:'68%'}}
    alignItems={'center'}
    flexDir={'column'}
    p={3}
    bg={'white'}
    borderRadius={'lg'}
    borderWidth={'1px'}>
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
    </Box>
  )
}

export default ChatBox
