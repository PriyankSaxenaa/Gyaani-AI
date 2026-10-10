import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function Nav() {
const {selectedConversation}=useSelector(state=>state.conversation)
const {messages}=useSelector(state=>state.message)
  return (
<>
    {selectedConversation &&   <div className='h-14 flex items-center gap-2.5  px-5 border-b border-outline-variant/20 bg-surface'>
      <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-secondary-container/15 border border-secondary-container/30'>
        <MessageSquare size={13} className="text-secondary"/>
      </div>
      <div className='font-display text-[14px] font-semibold text-on-surface tracking-tight'>
{selectedConversation?.title || "New Chat"}
      </div>
      <div className='font-mono text-[10px] font-medium text-on-surface-variant bg-surface-container-high border border-outline-variant/20 px-2 py-0.5 rounded-full'>
        {messages?.length} Messages
      </div>
    </div>}
  </>
  )
}

export default Nav
