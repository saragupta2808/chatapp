import React, { useEffect } from "react";
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel, HStack }  from "@chakra-ui/react";
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useHistory } from "react-router-dom";
const HomePage = () => {
  const history = useHistory();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if(user){
      history.push('/chats')
    }
  },[history])
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        backgroundColor="white"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        w="100%"
      >
        <Tabs variant="soft-rounded" >
          <TabList mb="1rem">
            <Tab width="100%">Login</Tab>
            <Tab width="100%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
