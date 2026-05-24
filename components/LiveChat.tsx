"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Bot, Paperclip, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "ai";
  content: string;
  image?: string; 
}

export default function LiveChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHiddenByMenu, setIsHiddenByMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm the AI Assistant for The Career Advisors. How can I help you with your MBBS journey today?" }
  ]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMenuToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsHiddenByMenu(customEvent.detail);
      if (customEvent.detail) setIsOpen(false); 
    };

    window.addEventListener("mobileMenuToggle", handleMenuToggle);
    return () => window.removeEventListener("mobileMenuToggle", handleMenuToggle);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, selectedImage]);

  if (pathname?.startsWith("/admin")) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Please upload an image smaller than 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage = input.trim();
    const imageToSend = selectedImage;
    
    setInput("");
    setSelectedImage(null);
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage, image: imageToSend || undefined }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          image: imageToSend, 
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
      } else {
        throw new Error("No reply received");
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "I'm having trouble connecting to my servers right now. Please try calling us directly at 916005152350." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // OPTIMIZATION: Pushed closer to the edge on mobile (bottom-4 right-4)
    <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[90] flex flex-col items-end transition-all duration-300 ease-out ${isHiddenByMenu ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[330px] sm:w-[380px] h-[500px] max-h-[75vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-heading leading-tight text-white">thecareeradvisors</h3>
                  <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors active:scale-95 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm flex flex-col gap-2 ${
                    msg.role === "user" 
                      ? "bg-destructive text-destructive-foreground rounded-br-sm" 
                      : "bg-card border border-border/50 text-foreground rounded-bl-sm"
                  }`}>
                    {msg.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={msg.image} alt="Uploaded" className="max-w-full rounded-xl object-contain border border-black/10" />
                    )}
                    {msg.content && <p>{msg.content}</p>}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview Area */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-muted border-t border-border/50 p-3 flex items-start justify-between"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={() => setSelectedImage(null)} className="p-1 bg-foreground/10 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 bg-card border-t border-border/50 flex gap-2 items-end">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-muted/50 text-foreground/60 hover:text-primary hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors"
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask any question..."
                className="flex-1 bg-muted/50 border border-border/50 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              
              <Button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="rounded-full w-10 h-10 p-0 bg-primary text-primary-foreground shrink-0 active:scale-95">
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE TOGGLE BUTTON */}
      <div className="relative flex items-center justify-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10, scale: 0.9 }} transition={{ delay: 2 }}
              // OPTIMIZATION: Tooltip moved closer since button is smaller
              className="absolute right-[60px] md:right-[70px] bg-card px-4 py-2 rounded-xl shadow-lg border border-border/50 whitespace-nowrap hidden sm:block"
            >
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-card border-t border-r border-border/50 rotate-45"></div>
              <p className="text-sm font-bold font-heading text-foreground relative z-10">Chat</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          // OPTIMIZATION: Reduced from w-16 to w-12 on mobile
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(66,99,235,0.4)] flex items-center justify-center relative z-20"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6 md:w-7 md:h-7" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  );
}