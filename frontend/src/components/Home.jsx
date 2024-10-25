import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import {io} from 'socket.io-client'
const socket = io('http://localhost:4000')

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [roomid, setroomid] = useState("")
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const user = Cookies.get('user')
    if (!user) {
      navigate('/login')
    } else {
      axios.get(`http://localhost:4000/user/${user}`)
        .then(response => {
          setCurrentUser(response.data.user)
        })
        .catch(error => console.error('Error fetching current user:', error))

      axios.get('http://localhost:4000/user')
        .then(response => {
          setUsers(response.data)
        })
        .catch(error => console.error('Error fetching users:', error))
    
        socket.on('receiveMessage', (messageData) => {
          console.log("Message received: ", messageData)
          setMessages((prevMessages) => (prevMessages ? [...prevMessages, messageData] : [messageData]))
        })
    
        socket.on('connect', () => {
          console.log('Connected to the server with ID:', socket.id)
        })
    
        return () => {
          socket.off('receiveMessage')
          socket.off('connect')
        }
      }
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = () => {
    Cookies.remove('user')
    Cookies.remove('startup')
    navigate('/login')
  }

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        sender:currentUser._id,
        message: message,
        type:"text"
      }
      socket.emit('sendMessage', {
        roomId: roomid,
        messageData: newMessage,
      })
      setMessage('')

    }
  }
  const roomjoin = (user) => {
    if (roomid) {
      // Emit leaveRoom event if already in a room
      socket.emit('leaveRoom', roomid);
    }

    setMessages([]);
    axios.get(`http://localhost:4000/user/getroom/${currentUser._id}/${user._id}`, { username: currentUser.username, room: 'room1' })
      .then(response => {
        console.log("Joining room", response.data);
        socket.emit('joinRoom', response.data.id);
        setroomid(response.data.id);
        if (response.data.messages) {
          setMessages(response.data.messages);
        }
      })
      .catch(error => console.error('Error joining room:', error));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <Link to="/" className="flex items-center py-5 px-2 text-white hover:text-indigo-200 transition duration-300">
                <span className="font-bold text-xl">ChatApp</span>
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link to="/home" className="py-5 px-3 text-white hover:text-indigo-200 transition duration-300">Home</Link>
                <Link to="/items" className="py-5 px-3 text-white hover:text-indigo-200 transition duration-300">Items</Link>
                <Link to="/chat" className="py-5 px-3 text-white hover:text-indigo-200 transition duration-300">Chat</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <button onClick={handleLogout} className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300 transform hover:scale-105">
                Log Out
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button p-2 focus:outline-none">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                  ) : (
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <Link to="/home" className="block py-2 px-4 text-sm hover:bg-indigo-700 transition duration-300">Home</Link>
          <Link to="/items" className="block py-2 px-4 text-sm hover:bg-indigo-700 transition duration-300">Items</Link>
          <Link to="/chat" className="block py-2 px-4 text-sm hover:bg-indigo-700 transition duration-300">Chat</Link>
          <button onClick={handleLogout} className="block w-full text-left py-2 px-4 text-sm hover:bg-red-600 transition duration-300">Log Out</button>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="flex flex-1 overflow-hidden p-4">
        {/* User List */}
        <div className="w-1/4 bg-white rounded-l-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-101">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <img 
                  src={`http://localhost:4000/uploads/profiles/${currentUser.profile_pic}`} 
                  alt={currentUser.username} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white" 
                />
                <div>
                  <p className="font-semibold">{currentUser.username}</p>
                  <p className="text-xs opacity-75">Online</p>
                </div>
              </div>
            )}
          </div>
          <div className="overflow-y-auto h-full">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-3 hover:bg-indigo-100 cursor-pointer transition duration-300 ${selectedUser?.id === user.id ? 'bg-indigo-100' : ''}`}
                onClick={() => {setSelectedUser(user); roomjoin(user)}}
              >
                <img 
                  src={`http://localhost:4000/uploads/profiles/${user.profile_pic}`} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200" 
                />
                <div>
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-lg ml-4">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-tr-lg">
            <h2 className="text-xl font-semibold">
              {selectedUser ? `Chat with ${selectedUser.username}` : 'Select a user to start chatting'}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                <div 
               className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg shadow-md ${
                msg.sender === currentUser._id 
                  ? 'bg-indigo-500 text-white self-end' 
                  : 'bg-gray-100 text-gray-800 self-start'
              } transform transition-all duration-300 ease-in-out hover:scale-105`}
              
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              />
              <button 
                onClick={handleSendMessage} 
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .flex-1 > div > div {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}