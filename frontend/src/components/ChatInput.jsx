import { Check, ChevronDown, Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import sendMessage from '../features/sendMessage'
import getCurrentUser from '../features/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'
import { setUserdata } from '../redux/userSlice'


function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const [agentMenuOpen, setAgentMenuOpen] = useState(false)
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages, isLoading } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileRef = useRef(null)
  const agentMenuRef = useRef(null)
  const dispatch = useDispatch()


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = ""

      for (let index = event.resultIndex; index < event.results.length; index++) {

        transcript += event.results[index][0].transcript
      }
      setValue(transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  useEffect(() => {
    if (!agentMenuOpen) return;
    const handleClickOutside = (e) => {
      if (agentMenuRef.current && !agentMenuRef.current.contains(e.target)) {
        setAgentMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [agentMenuOpen])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("speech recognition not supported")
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }

  }








  const handleSendMessage = async () => {
    dispatch(setIsLoading(true))
    let conversation = selectedConversation
    if (!conversation) {
      dispatch(setMessages([]))
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))

      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title == "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: value.slice(0, 40) }))
    }


    console.log(selectedFile)
    const formData = new FormData()
    formData.append("prompt", value.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())
    if (selectedFile) {
      formData.append("file", selectedFile)
    }



    dispatch(addMessage({ role: "user", content: value.trim() }))
    setValue("")
    try {
      const data = await sendMessage(formData)
      dispatch(setArtifacts(data?.artifacts || []))
      dispatch(addMessage({ role: "assistant", content: data?.answer || "Something went wrong. Please try again.", images: data?.images }))
      const updatedUser = await getCurrentUser()
      dispatch(setUserdata(updatedUser))
      console.log(data)
    } finally {
      dispatch(setIsLoading(false))
      setSelectedFile(null)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },

    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision"
    },

    {
      id: "search",
      icon: Globe,
      label: "Search"
    }

  ]

  const activeAgent = agents.find(a => a.label === selectedAgent) || agents[0]
  const ActiveIcon = activeAgent.icon

  return (
    <div className='w-full px-3 md:px-5 py-4 border-t border-outline-variant/20 bg-surface'>
      <div className='max-w-3xl mx-auto flex flex-col gap-2 bg-surface-container/70 backdrop-blur-xl border border-outline-variant/25 focus-within:border-primary/40 rounded-xl px-4 pt-3.5 pb-3 transition-colors duration-200'>

        <AnimatePresence>
        {
          selectedFile && <motion.div
            initial={{ opacity: 0, transform: 'scale(0.96) translateY(-4px)' }}
            animate={{ opacity: 1, transform: 'scale(1) translateY(0px)' }}
            exit={{ opacity: 0, transform: 'scale(0.96) translateY(-4px)' }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className='my-3'
          >

            <div className='inline-flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container px-3 py-2'>
              {
                selectedFile?.type === "application/pdf" ? <FileText size={16}

                  className="text-error"
                /> : selectedFile.type.startsWith("image/") && <img src={URL.createObjectURL(selectedFile)} className="h-10 w-10 rounded-lg object-cover mt-3"
                />
              }

              <div>
                <p className='text-xs text-on-surface'>
                  {selectedFile?.name}
                </p>
                <p className='font-mono text-[10px] text-on-surface-variant'>
                  {Math.ceil(selectedFile.size)}KB
                </p>

              </div>
              <button className='ml-2 transition-transform duration-150 active:scale-90' onClick={() => { setSelectedFile(null); fileRef.current.value = "" }}><X size={14} className='text-on-surface-variant hover:text-on-surface' /></button>
            </div>


          </motion.div>
        }
        </AnimatePresence>


        <textarea
          placeholder='Ask Anything...'
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-on-surface placeholder:text-on-surface-variant/50 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-1'>

            <input type="file" accept='.pdf,image/*' hidden ref={fileRef} onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setSelectedFile(file)
              }
            }} />

            <div className='relative' ref={agentMenuRef}>
              <button
                onClick={() => setAgentMenuOpen(o => !o)}
                className='flex items-center gap-1.5 h-8 pl-2.5 pr-2 rounded-lg text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/20 transition-all duration-150 active:scale-95 bg-transparent cursor-pointer'
              >
                <ActiveIcon size={14} className={selectedAgent !== "Auto" ? "text-secondary" : "text-on-surface-variant"} />
                {selectedAgent}
                <ChevronDown size={13} className={`transition-transform duration-200 ${agentMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {agentMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, transform: 'scale(0.96) translateY(4px)' }}
                    animate={{ opacity: 1, transform: 'scale(1) translateY(0px)' }}
                    exit={{ opacity: 0, transform: 'scale(0.96) translateY(4px)' }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                    style={{ transformOrigin: 'bottom left' }}
                    className='absolute bottom-full mb-2 left-0 w-52 rounded-lg border border-outline-variant/25 bg-surface-container-low/95 backdrop-blur-xl shadow-[0_12px_32px_-4px_rgba(0,0,0,0.65)] p-1 z-20'
                  >
                    {agents.map((agent) => {
                      const isActive = selectedAgent === agent.label
                      const Icon = agent.icon
                      return (
                        <button
                          key={agent.id}
                          onClick={() => { setSelectedAgent(agent.label); setAgentMenuOpen(false) }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${isActive ? "bg-secondary-container/20 text-on-surface" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"}`}
                        >
                          <Icon size={14} className={isActive ? "text-secondary" : "text-on-surface-variant"} />
                          {agent.label}
                          {isActive && <Check size={13} className="ml-auto text-secondary" />}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className='flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent hover:border-outline-variant/20 transition-all duration-150 active:scale-90 bg-transparent cursor-pointer' onClick={() => fileRef.current.click()}>
              <Paperclip size={16} />
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 active:scale-90 cursor-pointer ${listening ?"bg-error-container text-on-error-container":"text-on-surface-variant hover:bg-surface-container-high" }`}>
             {listening?<Mic size={16} />:<MicOff size={16}/>}
            </button>
          </div>
          <button
            disabled={!value && isLoading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 active:scale-90 ${value.trim() ? "bg-primary hover:bg-primary/90 text-on-primary" : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"}`}>
          <Send size={15} />
        </button>
      </div>
    </div>
    </div >
  )
}

export default ChatInput
