import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import React from 'react'
import axios from '../../axios'
import { useHistory } from "react-router-dom";

const Login = () => {
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false)
    const [show, setShow] = React.useState(false);
    const toast = useToast();
    const history = useHistory();
    const handleSubmit = async()=>{
    setLoading(true);
    if(!email || !password ){
        toast({
            title: 'Please fill all the required fields',
            status: 'error',
            duration: 4000,
            isClosable: true,
            
          })
        return;
    }
   

    try {
        const config = {
            headers:{
                "Content-type":"application/json",
            }
        }
        const {data} = await axios.post("/api/user/login",{
            email, password
        }, config)
        toast({
            title: 'Login Successful',
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        localStorage.setItem('userInfo', JSON.stringify(data));        
        history.push('/chats')
        setLoading(false)

    } catch (error) {
      // console.log(error)
        toast({
            title: 'Error Occured',
            description:`${error.response.data.message}`,
            status: 'error',
            duration: 4000,
            isClosable: true,
        })
        setLoading(false);
        return;
    }
    }
  return (
    <VStack spacing="10px">
    
    <FormControl id="email" isRequired>
      <FormLabel>Email </FormLabel>
      <Input
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel>Password </FormLabel>
      <InputGroup>
      <Input
        placeholder="Enter your password"
        type={ show ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputRightElement width={"4.5rem"}>
          <Button onClick={()=> setShow(show => !show)} h="1.75rem" size={"sm"}>
              {show ? "Hide" :"Show"}
          </Button>
      </InputRightElement>
      </InputGroup>
      
    </FormControl>
   

    

    <Button 
      colorScheme="blue"
      width={"100%"}
      marginTop={"15px"}
      onClick={handleSubmit}
      isLoading={loading}
    >
      Login
    </Button>
    <Button 
      colorScheme="red"
      variant="solid"
      width={"100%"}
      marginTop={"15px"}
      onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456")
      }}
    >
      Get Guest User Credentials
    </Button>
  </VStack>
  )
}

export default Login
