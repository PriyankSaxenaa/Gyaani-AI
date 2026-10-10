import { Check, Copy, ExternalLink, FileX2, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`w-fit max-w-[92vw] md:max-w-[72%]
  px-4 py-2.5
  break-words overflow-hidden
  leading-relaxed
        ${isUser
          ? "bg-surface-container-high text-on-surface rounded-xl rounded-tr-sm"
          : "text-on-surface border-l-2 border-secondary-container/40 pl-3.5"
        }`}>


        {images.length > 0 && (
          <div className='flex flex-wrap gap-3 mt-4'>
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-lg object-cover border border-outline-variant/25 cursor-zoom-in hover:opacity-90 transition"

              />
            ))}
          </div>
        )}


        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-lg font-semibold mt-3 mb-2'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='mb-3 whitespace-pre-wrap break-words'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>
            ),
            table: ({ children }) => (
              <div className='overflow-x-auto my-4'>
                <table className='min-w-full border border-outline-variant/25'>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (

              <th className='font-mono border border-outline-variant/25 bg-surface-container px-3 py-2 text-left'>
                {children}
              </th>

            ),
            td: ({ children }) => (

              <td className='border border-outline-variant/25 px-3 py-2'>
                {children}
              </td>

            ),

            a: ({ href, children }) => (

              <a href={href}
                target="_blank"
                rel="noreferrer"
                className="text-secondary underline inline-flex items-center gap-1"
              >
                {children}
                <ExternalLink size={14} />
              </a>

            ),
            code: ({ className, children }) => {
              const value = String(children).trim()


              if (!className) {
                return (
                  <code className='font-mono px-1.5 py-0.5 rounded bg-surface-container-high text-primary'>
                    {value}
                  </code>
                )

              }

              const language = className.replace("language-", "")

              return (
                <div className='my-4 overflow-hidden rounded-lg border border-outline-variant/25 bg-surface-container-lowest'>
                  <div className='flex items-center justify-between bg-surface-container border-b border-outline-variant/25 px-4 py-2'>
                    <span className='font-mono uppercase text-xs text-on-surface-variant'>
                      {language}
                    </span>
                    <button className='flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface transition-colors duration-150'
                    onClick={() => copyCode(value)}>
                      {
                        copiedCode == value ?
                          <>
                            <Check size={14}/>
                            Copied
                          </> :
                          <><Copy size={14} />Copy</>
                      }
                    </button>
                  </div>


                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#0a0e16",
                      fontSize: "13px",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    }}

                  >
                    {value}
                  </SyntaxHighlighter>


                </div>
              )
            },
          img:({src})=>{
            if(!src)return null;
            return (
              <img
                src={src}
                onClick={() => setLightBox(src)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-40 h-28 rounded-lg object-cover border border-outline-variant/25 cursor-zoom-in hover:opacity-90 transition"
              />
            )
          }





          }}
        >
          {content}
        </Markdown>



      </div>
      <AnimatePresence>
      {lightBox &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={() => setLightBox(null)}
          className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6'
        >
          <button
            className='absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 transition-transform duration-150 active:scale-90'
            onClick={() => setLightBox(null)}
          >
            <X />
          </button>
          <motion.img
            src={lightBox}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, transform: 'scale(0.95)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={{ opacity: 0, transform: 'scale(0.95)' }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-[90vw] max-h-[85vh] rounded-xl border border-outline-variant/25 shadow-2xl object-contain"
          />

        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default MessageBubble
