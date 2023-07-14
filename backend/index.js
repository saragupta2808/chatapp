const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')

const {notFound, errorHandler} = require('./middleware/errorMiddleware')

dotenv.config();

app.use(express.json()); //to accept json data
app.use(cors());

app.use('/api/user',userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message',messageRoutes)


// ------------------------Deployment------------------------
const __dirname1 = path.resolve();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,'..','/frontend/chat-app/dist')));
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname1,'..','frontend','chat-app','dist','index.html'))
    });

}

else{
    app.get('/', (req,res)=>{
        res.send('API is running...')
    })
    
}






// ------------------------Deployment------------------------

app.use(notFound)
app.use(errorHandler)





const PORT = process.env.PORT || 5000;
connectDB();
const server = app.listen(PORT, console.log(`Server listening on port ${PORT}`.yellow.bold))
const io = require('socket.io')(server,{
    pingTimout : 60000,
    cors:{
        origin: 'http://localhost:5173'
    }
})

io.on('connection',(socket)=>{
    console.log("Connected to socket.io".white.underline);


    //setting up socket for a user once he is connected to the app
    socket.on('setup',(userData)=>{
        //creating a room for that particular user
        socket.join(userData._id)
        // console.log(userData._id)
        socket.emit('Connected')
    })


    //now joining the chat to socket
    //when we click on a chat this should create a room with that particular user and the other user in the chat when he joins
    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log('User joined room: ' +room)
    })


    socket.on('typing',(room)=> socket.in(room).emit('typing'));

    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users) 
            return console.log('chat.users is not defined')
        
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id)
                return;
            socket.in(user._id).emit('message received', newMessageReceived)
        });
    })


    socket.off("setup", ()=>{
        console.log('USER DISCONNECTED');
        socket.leave(userData._id)
    })
});