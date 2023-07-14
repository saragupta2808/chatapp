import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={'lg'}
    m={1}
    mb={2}
    variant='solid'
    fontSize={'14'}
    backgroundColor={'purple'}
    color={'white'}
    cursor={'pointer'}
    onClick={handleFunction}>
        {user.name}
        <CloseIcon p={0.5}/>
    </Box>
  )
}

export default UserBadgeItem
