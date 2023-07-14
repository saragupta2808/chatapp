import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import React from "react";
import axios from '../../axios'
import { useHistory } from "react-router-dom";
const SignUp = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pic, setPic] = React.useState();
  const [loading, setLoading] = React.useState(false)
  const [show, setShow] = React.useState(false);
  const toast = useToast()
  const history = useHistory();
  const handleSubmit = async()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
        toast({
            title: 'Please fill all the required fields',
            status: 'error',
            duration: 4000,
            isClosable: true,
            isClosable: true,
          })
        return;
    }
    if(password != confirmPassword){
        toast({
            title: 'Passwords do not match!',
            status: 'error',
            duration: 4000,
            isClosable: true,
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
        const {data} = await axios.post("/api/user",{
            name, email, password, pic
        }, config)
        
        toast({
            title: 'Registartion Successful',
            status: 'success',
            duration: 4000,
            isClosable: true,
        })

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false)
        history.push('/chats')

    } catch (error) {
        toast({
            title: 'Error Occured',
            description:`${error.response.data.message}`,
            status: 'error',
            duration: 4000,
            isClosable: true,
            isClosable: true,
        })
        setLoading(false);
        return;
    }
  }

  const postDetails = (pic)=>{
    setLoading(true);
    if(pic == undefined){
        toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 4000,
            isClosable: true,
            isClosable: true,
          })
        return;
    }
    if(pic.type === "image/jpeg" || pic.type === "image/png"){
        const data = new FormData();
        data.append("file",pic);
        data.append("upload_preset","chat-app")
        data.append("cloud_name", "dwplasxu8")
        fetch("https://api.cloudinary.com/v1_1/dwplasxu8", {
            method: 'post',
            body:data
        }).then((res)=> res.json())
        .then((data)=>{
            setPic(data.url.toString());
            setLoading(false)
        })
        .catch((err)=>{
            console.log(err);
            setLoading(false)
        })
    }
    else{
        toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 4000,
            isClosable: true,
            isClosable: true,
          })
        return;
    }
  }
  
  return (
    <VStack spacing="10px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name </FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email </FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password </FormLabel>
        <InputGroup>
        <Input
          placeholder="Enter your password"
          type={ show ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width={"4.5rem"}>
            <Button onClick={()=> setShow(show => !show)} h="1.75rem" size={"sm"}>
                {show ? "Hide" :"Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password </FormLabel>
        <InputGroup>
        <Input
          placeholder="Confirm your password"
          type={ show ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement width={"4.5rem"}>
            <Button onClick={()=> setShow(show => !show)} h="1.75rem" size={"sm"}>
                {show ? "Hide" :"Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
        
      </FormControl>


      <FormControl id="pic">
        <FormLabel>Picture</FormLabel>
       
        <Input
          placeholder="Upload your profile picture"
          type="file"
          p="1.5"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        
        
      </FormControl>

      <Button 
        colorScheme="blue"
        width={"100%"}
        marginTop={"15px"}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
