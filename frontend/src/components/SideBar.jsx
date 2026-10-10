import React from 'react'
import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenBoxIcon, PenSquare, Plus, User, X } from "lucide-react"
import { useState } from 'react'
import { useEffect } from 'react'
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'

import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserdata } from '../redux/userSlice'
import BillingDrawer from './BillingDrawer'
import ThemeToggle from './ThemeToggle'
function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    const [showBilling,setShowBilling]=useState(false)
    const [mobileOpen,setMobileOpen]=useState(false)
    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversations(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
    }



    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[56px] h-screen bg-surface-container-low border-r border-outline-variant/20 py-4 gap-1 shrink-0'>
                <button className='flex items-center justify-center w-9 h-9 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1'
                    onClick={() => setCollapsed(false)}
                >
                    <PanelRight />
                </button>

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150 bg-transparent border-none cursor-pointer '
                    onClick={()=>dispatch(setSelectedConversation(null))}
                >
                    <Plus size={17} />
                </button>

                <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5'>
                    {conversations.map((conv, i) => {
                        const isActive = selectedConversation?._id == conv?._id
                        return (
                            <div
                                key={conv?._id || i}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                ${isActive ? "bg-secondary-container/15 border-secondary-container/30"
                                        : "bg-transparent border-transparent"}`}>
                                <div className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
                ${isActive ? "bg-secondary-container/25 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>
                                    <MessageSquare size={13} />
                                </div>


                            </div>
                        )
                    })}

                </div>

<div className='"relative shrink-0'>
                                {
                                    (userData?.avatar && !imageError)
                                        ?
                                        <img
                                            className='w-9 h-9 rounded-[10px] object-cover border-2 border-primary/30'
                                            src={userData?.avatar}
                                            alt={"image"}
                                            onError={() => setImageError(true)} />
                                        :
                                        <div className='w-9 h-9 rounded-[10px] bg-surface-container-high flex items-center justify-center'>
                                            <User size={15} className="text-on-surface-variant" />
                                        </div>

                                }

                            </div>


            </div>
        )
    }


    return (
        <>

       <button className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-on-surface transition-colors duration-150 cursor-pointer' onClick={()=>setMobileOpen(true)}>
            <Menu size={14}/>
         </button>

         {mobileOpen && <div onClick={()=>setMobileOpen(false)} className='lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm'/>}



        <div className={` fixed lg:static inset-y-0 left-0 z-50
        w-[270px] h-screen shrink-0
        bg-surface-container-low border-r border-outline-variant/20
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
      >



            <div className='flex flex-col h-full'>
                <div className='flex items-center gap-2.5 px-4 py-4 border-b border-outline-variant/20'>
                    <div className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150 bg-transparent border-none cursor-pointer'
                        onClick={() => setCollapsed(true)}
                    >
                        <PanelLeftIcon />
                    </div>

                    <button  onClick={() => setMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150 bg-transparent border-none cursor-pointer"
>
                        <X/>
                    </button>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <img src='/logo.png' alt='' className='w-7 h-7 rounded-lg object-cover shrink-0' />
                        <span className='font-display text-[16px] font-semibold text-on-surface tracking-tight truncate'>
                            Gyaani AI
                        </span>
                    </div>
                    <span className='font-mono text-[10px] font-medium text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full tracking-wide uppercase'>{userData?.plan || "free"}</span>
                    <button className='flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-150 bg-transparent border-none cursor-pointer'
                        onClick={()=>dispatch(setSelectedConversation(null))}>
                        <PenSquare size={14} />
                    </button>
                    <ThemeToggle />
                </div>

                <div className='px-4 pt-4 pb-1'>
                    <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-on-primary bg-primary rounded-md py-[10px] border-none cursor-pointer hover:bg-primary/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-150 active:scale-[0.97]'
                        onClick={()=>dispatch(setSelectedConversation(null))}
                    >
                        <Plus size={15} />
                        New Chat
                    </button>
                </div>

                {conversations.length == 0
                    ?
                    <div className='font-mono px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant'>
                        No Recent Conversations
                    </div>
                    :
                    (
                        <div className='font-mono px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-on-surface-variant'>
                            Recents
                        </div>
                    )}


                <div className='flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                    {conversations?.map((conv, i) => {
                        const isActive = selectedConversation?._id == conv?._id
                        return (
                            <div
                                key={conv?._id || i}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                ${isActive ? "bg-secondary-container/15 border-secondary-container/30"
                                        : "bg-transparent border-transparent"}`}>
                                <div className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
                ${isActive ? "bg-secondary-container/25 text-secondary" : "bg-surface-container-high text-on-surface-variant"}`}>
                                    <MessageSquare size={13} />
                                </div>
                                <span className={`text-[13px] font-medium truncate ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
                                    {conv?.title || "New Chat"}
                                </span>

                            </div>
                        )
                    })}

                </div>

                <div className='mx-2.5 h-px bg-outline-variant/20' />
                <div className='px-3.5 py-3.5'>
                    {userData ? (
                        <div className='flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-surface-container-high transition-colors duration-150'>
                            <div className='"relative shrink-0'>
                                {
                                    (userData?.avatar && !imageError)
                                        ?
                                        <img
                                            className='w-9 h-9 rounded-[10px] object-cover border-2 border-primary/30'
                                            src={userData?.avatar}
                                            alt={"image"}
                                            onError={() => setImageError(true)} />
                                        :
                                        <div className='w-9 h-9 rounded-[10px] bg-surface-container-high flex items-center justify-center'>
                                            <User size={15} className="text-on-surface-variant" />
                                        </div>

                                }

                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-[13.5px] font-semibold text-on-surface truncate'>{userData?.name || "user"}</p>
                                <p className='font-mono text-[11px] text-on-surface-variant mt-px uppercase'>{`${userData?.plan}` || "free plan"} </p>
                            </div>
                            <div className='flex gap-1'>
                                <button
                                onClick={()=>setShowBilling(true)}
                                className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-primary cursor-pointer hover:bg-surface-container-highest transition-all duration-150 active:scale-90'>
                                    <Coins size={16} />
                                </button>
                                <button className='flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-on-surface-variant cursor-pointer hover:bg-surface-container-highest hover:text-on-surface transition-all duration-150 active:scale-90'
                                    onClick={() => {
                                        logOut();
                                        dispatch(setUserdata(null))
                                    }}
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>)
                        :
                        <button className='w-full flex items-center justify-center gap-2 text-sm font-medium text-on-surface bg-surface-container-high border border-outline-variant/30 rounded-md py-[11px] cursor-pointer hover:bg-surface-container-highest transition-all duration-150 active:scale-[0.97]'>
                            Login
                        </button>}
                </div>
            </div>

        </div>


           <BillingDrawer
           open={showBilling}
           onClose={()=>setShowBilling(false)}
           />

        </>
    )




}

export default SideBar
