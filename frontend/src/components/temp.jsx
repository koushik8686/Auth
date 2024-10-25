"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Mock function to simulate API calls
const mockApiCall = (endpoint: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes('user/')) {
        resolve({ data: { user: { id: 0, username: 'John Doe', profile_pic: 'john-doe.jpg' } } })
      } else {
        resolve({
          data: [
            { id: 1, username: 'Alice', profile_pic: 'alice.jpg' },
            { id: 2, username: 'Bob', profile_pic: 'bob.jpg' },
            { id: 3, username: 'Charlie', profile_pic: 'charlie.jpg' },
          ]
        })
      }
    }, 500)
  })
}

interface User {
  id: number
  username: string
  profile_pic: string
}

export default function Component() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ id: number; text: string; sender: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await mockApiCall('user/current') as { data: { user: User } }
        setCurrentUser(userResponse.data.user)

        const usersResponse = await mockApiCall('users') as { data: User[] }
        setUsers(usersResponse.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login')
  }

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'You'
      }
      setMessages([...messages, newMessage])
      setMessage('')

      // Simulate a reply after 1 second
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          text: `This is a reply from ${selectedUser.username}`,
          sender: selectedUser.username
        }
        setMessages(prevMessages => [...prevMessages, reply])
      }, 1000)
    }
  }

  return (
    <div className="chat-container">
      <div className="user-list">
        <div className="current-user">
          {currentUser && (
            <>
              <img src={`/placeholder.svg?height=40&width=40`} alt={currentUser.username} className="avatar" />
              <div className="user-info">
                <p className="username">{currentUser.username}</p>
                <p className="status">You</p>
              </div>
            </>
          )}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="users-scroll">
          {users.map((user) => (
            <div
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={`/placeholder.svg?height=40&width=40`} alt={user.username} className="avatar" />
              <div className="user-info">
                <p className="username">{user.username}</p>
                <p className="status">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-area">
        <h2 className="chat-header">
          {selectedUser ? `Chat with ${selectedUser.username}` : 'Select a user to start chatting'}
        </h2>
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
        </div>
      </div>
      <style jsx>{`
        .chat-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          background-color: #f0f2f5;
        }
        .user-list {
          width: 300px;
          background-color: #2c3e50;
          color: #ecf0f1;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }
        .user-list:hover {
          width: 320px;
        }
        .current-user {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #34495e;
          background-color: #34495e;
        }
        .logout-btn {
          margin-left: auto;
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logout-btn:hover {
          background-color: #c0392b;
        }
        .users-scroll {
          overflow-y: auto;
          flex-grow: 1;
        }
        .user-item {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .user-item:hover, .user-item.selected {
          background-color: #34495e;
          transform: translateX(5px);
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
          transition: transform 0.3s ease;
        }
        .user-item:hover .avatar {
          transform: scale(1.1);
        }
        .user-info {
          flex-grow: 1;
        }
        .username {
          font-weight: bold;
          margin: 0;
        }
        .status {
          font-size: 0.8em;
          color: #bdc3c7;
          margin: 0;
        }
        .chat-area {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-color: #ecf0f1;
        }
        .chat-header {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
        }
        .messages-container {
          flex-grow: 1;
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          overflow-y: auto;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .message {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 20px;
          animation: fadeIn 0.5s ease;
        }
        .message.sent {
          align-self: flex-end;
          background-color: #3498db;
          color: white;
        }
        .message.received {
          align-self: flex-start;
          background-color: #e0e0e0;
          color: #333;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-input {
          display: flex;
          gap: 10px;
        }
        .message-input input {
          flex-grow: 1;
          padding: 12px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          background-color: #fff;
          transition: box-shadow 0.3s ease;
        }
        .message-input input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #3498db;
        }
        .send-btn {
          padding: 12px 24px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .send-btn:hover {
          background-color: #2980b9;
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .chat-container {
            flex-direction: column;
          }
          .user-list {
            width: 100%;
            height: 30vh;
          }
          .chat-area {
            height: 70vh;
          }
        }
      `}</style>
    </div>
  )
}