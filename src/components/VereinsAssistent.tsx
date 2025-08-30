'use client'

import React, { useState } from 'react'
import { IconSend, IconRobot, IconUser } from '@tabler/icons-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export default function VereinsAssistent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hallo! Ich bin der SV Viktoria Wertheim Assistent. Wie kann ich Ihnen helfen?',
      sender: 'assistant',
      timestamp: new Date()
    },
    {
      id: 2,
      text: 'Wann ist das nächste Heimspiel?',
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: 3,
      text: 'Das nächste Heimspiel findet am Sonntag, 15.12.2024 um 14:30 Uhr gegen FC Beispielstadt statt.',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setInputValue('')
      
      // Simulate assistant response
      setTimeout(() => {
        const assistantResponse: Message = {
          id: messages.length + 2,
          text: 'Diese Funktion ist noch in Entwicklung. Bald kann ich Ihnen alle Fragen zum Verein beantworten!',
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantResponse])
      }, 1000)
    }
  }

  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3 flex-shrink-0">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Vereins Assistent</h3>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 min-h-0 max-h-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-1.5 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-viktoria-blue dark:bg-viktoria-yellow' 
                  : 'bg-gray-200 dark:bg-viktoria-dark-lighter'
              }`}>
                {message.sender === 'user' ? (
                  <IconUser size={12} className="text-white dark:text-gray-900" />
                ) : (
                  <IconRobot size={12} className="text-viktoria-blue dark:text-viktoria-yellow" />
                )}
              </div>
              <div className={`px-2.5 py-1.5 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-viktoria-dark-lighter text-gray-800 dark:text-gray-200'
              }`}>
                <p className="text-xs">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-viktoria-dark-lighter p-3 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Frage eingeben... (Demo-Version)"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-viktoria-dark-lighter border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-viktoria-blue dark:focus:ring-viktoria-yellow focus:border-transparent"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-viktoria-blue dark:bg-viktoria-yellow text-white dark:text-gray-900 rounded-lg hover:bg-viktoria-blue-light dark:hover:bg-yellow-500 transition-colors flex items-center justify-center"
          >
            <IconSend size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}