import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'

function MessageList() {
    const {selectedConversation}=useSelector(state=>state.conversation)
    const {messages,isLoading}=useSelector(state=>state.message)
    const bottemRef=useRef(null)
   
   useEffect(()=>{
       requestAnimationFrame(()=>{
        bottemRef?.current?.scrollIntoView({
          behavior:"smooth",
          block:"end"
        })
       })
   },[messages?.length,isLoading])


  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      
      {messages.length==0 || !selectedConversation ?(
        <motion.div
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="h-full flex flex-col items-center justify-center gap-3 text-center"
        >
           <motion.img
             src='/logo.png'
             alt='Gyaani AI'
             className='h-40 w-auto drop-shadow-[0_0_28px_rgba(245,158,11,0.2)]'
             initial={{ opacity: 0, transform: 'translateY(8px) scale(0.95)' }}
             animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
             transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
           />
           <motion.p
             className='text-[17px] font-medium text-on-surface-variant tracking-tight'
             initial={{ opacity: 0, transform: 'translateY(8px)' }}
             animate={{ opacity: 1, transform: 'translateY(0px)' }}
             transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
           >
               Search anything on Gyaani AI by Priyank Saxena
           </motion.p>
        </motion.div>
      ):
      <div className='space-y-5 max-w-3xl mx-auto w-full'>

        <AnimatePresence initial={false}>
          {messages?.map((msg,i)=>(
              <motion.div
                key={msg?._id || `${msg?.role}-${i}`}
                layout="position"
                initial={{ opacity: 0, transform: 'translateY(10px) scale(0.98)' }}
                animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                 <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} />
              </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && <LoadingAnimation/>}


      </div>
      }
      <div ref={bottemRef}/>
    </div>
  )
}

export default MessageList
