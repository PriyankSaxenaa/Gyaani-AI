import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Crown, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'
import getCurrentUser from '../features/getCurrentUser'
import { setUserdata } from '../redux/userSlice'
function BillingDrawer({ open, onClose }) {

    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const creditRatio = (userData?.credits || 0) / (userData?.totalCredits || 1)
    const meterColor = creditRatio > 0.5 ? "bg-tertiary" : creditRatio > 0.15 ? "bg-primary" : "bg-error"

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency,
                name: "Gyaani AI",
                description: `${data?.plan?.name} Plan`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    try {
                        const data = await verifyPayment(response)
                        console.log(data)
                        const updatedUser = await getCurrentUser()
                        dispatch(setUserdata(updatedUser))
                    } catch (error) {
                        console.log(error)
                    }
                },
                theme: {
                    color: "#f59e0b"
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AnimatePresence>
            {open && <> <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: .5 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black z-40"
            />
                <motion.div
                    initial={{ transform: "translateX(100%)" }}
                    animate={{ transform: "translateX(0%)" }}
                    exit={{ transform: "translateX(100%)" }}
                    transition={{ duration: .3, ease: [0.32, 0.72, 0, 1] }}
                    className="fixed right-0 top-0 z-50 h-screen w-[380px] bg-surface-container-low border-l border-outline-variant/20 shadow-2xl flex flex-col"

                >

                    <div className='flex items-center justify-between p-5 border-b border-outline-variant/20'>
                        <div>
                            <div className='font-display text-on-surface text-lg font-semibold'>
                                Billing
                            </div>
                            <div className='text-on-surface-variant text-sm'>
                                Plans & Credits
                            </div>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-transform duration-150 active:scale-90 flex items-center justify-center"
                        >
                            <X size={18} className="text-on-surface-variant" />
                        </button>
                    </div>


                    <div className='p-5'>
                        <div className='rounded-lg bg-surface-container border border-outline-variant/20 p-4'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <p className='text-on-surface-variant text-sm'>
                                        Current Plan
                                    </p>
                                    <h3 className='font-display text-on-surface text-xl font-bold capitalize'>
                                        {userData?.plan || "free"}
                                    </h3>
                                </div>
                                <Crown className='text-primary' />
                            </div>

                            <div className='mt-5'>
                                <div className='flex justify-between font-mono text-xs text-on-surface-variant mb-2'>
                                    <span>Credits</span>
                                    <span>{userData.credits || 0}/{userData.totalCredits || 100}</span>
                                </div>

                                <div className='h-1 rounded-full bg-surface-container-highest overflow-hidden'>
                                    <div className={`h-full ${meterColor} transition-all duration-500`}
                                        style={{
                                            width: `${(
                                                (userData?.credits || 0) /
                                                (userData?.totalCredits || 1)
                                            ) * 100
                                                }%`
                                        }}
                                    />
                                </div>


                            </div>



                        </div>
                    </div>

                    <div className='px-5 flex-1 overflow-auto space-y-4'>

                        <div className='rounded-lg border border-outline-variant/20 p-4'>
                            <h3 className='text-on-surface font-semibold'>Plus Plan</h3>
                            <p className='text-primary text-2xl font-bold mt-2'>₹199</p>
                            <p className='text-on-surface-variant text-sm mt-1'>500 Credits</p>
                            <button className='mt-4 w-full rounded-md bg-primary hover:bg-primary/90 py-2 text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform duration-150 active:scale-[0.97]' onClick={() => handleUpgrade("plus")}>Upgrade</button>
                        </div>
                        <div className='rounded-lg border border-outline-variant/20 p-4'>
                            <h3 className='text-on-surface font-semibold'>Pro Plan</h3>
                            <p className='text-primary text-2xl font-bold mt-2'>₹499</p>
                            <p className='text-on-surface-variant text-sm mt-1'>1000 Credits</p>
                            <button className='mt-4 w-full rounded-md bg-primary hover:bg-primary/90 py-2 text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform duration-150 active:scale-[0.97]' onClick={() => handleUpgrade("pro")}>Upgrade</button>
                        </div>
                    </div>









                </motion.div>
            </>
            }

        </AnimatePresence>
    )
}

export default BillingDrawer
