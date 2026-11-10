import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { 
  getUserChats, 
  createNewChatSession, 
  deleteChatSession, 
  getSessionMessages, 
  saveSessionMessages, 
  updateChatSessionTitle 
} from "./firebase/db";
import { generateStreamWithFailover, MODEL_FALLBACK_QUEUE } from "./utils/gemini";
import { buildSystemPrompt } from "./utils/prompts";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeHero from "./components/WelcomeHero";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";
import ApiKeyModal from "./components/ApiKeyModal";
import AuthModal from "./components/AuthModal";
import FirebaseModal from "./components/FirebaseModal";

export default function App() {
  const { 
    user, 
    isConfigured, 
    showAuthModal, 
    openAuthModal, 
    closeAuthModal, 
    showFirebaseModal, 
    openFirebaseModal, 
    closeFirebaseModal 
  } = useAuth();

  // Navigation & Faculty/Mode State
  const [selectedFaculty, setSelectedFaculty] = useState("Semua Fakultas");
  const [currentMode, setCurrentMode] = useState("simple");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Chat Sessions & Messages State
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Generation & Streaming State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModelName, setActiveModelName] = useState(MODEL_FALLBACK_QUEUE[0]);
  const abortControllerRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Modals & Toast State
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2600);
  };

  // Load chat sessions on mount or when user changes
  useEffect(() => {
    async function loadChats() {
      const userChats = await getUserChats(user?.uid);
      setChats(userChats);
      if (userChats.length > 0) {
        setActiveChatId(userChats[0].id);
        const msgs = await getSessionMessages(userChats[0].id, user?.uid);
        setMessages(msgs);
        if (userChats[0].faculty) setSelectedFaculty(userChats[0].faculty);
        if (userChats[0].mode) setCurrentMode(userChats[0].mode);
      } else {
        setActiveChatId(null);
        setMessages([]);
      }
    }
    loadChats();
  }, [user]);

  // Load messages when active chat changes
  const handleSelectChat = async (chatId) => {
    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
    setActiveChatId(chatId);
    const msgs = await getSessionMessages(chatId, user?.uid);
    setMessages(msgs);
    const targetChat = chats.find(c => c.id === chatId);
    if (targetChat?.faculty) setSelectedFaculty(targetChat.faculty);
    if (targetChat?.mode) setCurrentMode(targetChat.mode);
  };

  // Start new chat session
  const handleNewChat = () => {
    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
    setActiveChatId(null);
    setMessages([]);
    setInput("");
    showToast("Sesi obrolan baru siap!");
  };

  // Delete chat session
  const handleDeleteChat = async (chatId) => {
    await deleteChatSession(chatId, user?.uid);
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        handleSelectChat(updatedChats[0].id);
      } else {
        handleNewChat();
      }
    }
    showToast("Obrolan dihapus.");
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Stop Generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    showToast("Generasi dihentikan.");
  };

  // Submit User Message
  const handleSubmitMessage = async (customPrompt) => {
    const question = (customPrompt || input).trim();
    if (!question || isGenerating) return;

    setInput("");

    // Create session if not existing
    let currentChatId = activeChatId;
    if (!currentChatId) {
      const previewTitle = question.length > 36 ? question.slice(0, 36) + "..." : question;
      const newSession = await createNewChatSession(user?.uid, previewTitle, selectedFaculty, currentMode);
      currentChatId = newSession.id;
      setActiveChatId(currentChatId);
      setChats(prev => [newSession, ...prev]);
    }

    const newMessages = [
      ...messages,
      { role: "user", content: question }
    ];
    setMessages(newMessages);

    // Placeholder for incoming assistant response
    const assistantIndex = newMessages.length;
    const messagesWithPlaceholder = [
      ...newMessages,
      { role: "model", content: "", modelUsed: MODEL_FALLBACK_QUEUE[0] }
    ];
    setMessages(messagesWithPlaceholder);

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    // Prepare API history
    const apiHistory = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    let fullGeneratedText = "";
    let finalModel = MODEL_FALLBACK_QUEUE[0];

    try {
      await generateStreamWithFailover({
        history: apiHistory,
        systemPrompt: buildSystemPrompt(currentMode, selectedFaculty),
        signal: abortControllerRef.current.signal,
        onStartModel: (model) => {
          finalModel = model;
          setActiveModelName(model);
          setMessages(prev => {
            const copy = [...prev];
            if (copy[assistantIndex]) copy[assistantIndex].modelUsed = model;
            return copy;
          });
        },
        onChunk: (chunkText) => {
          fullGeneratedText += chunkText;
          setMessages(prev => {
            const copy = [...prev];
            if (copy[assistantIndex]) {
              copy[assistantIndex].content = fullGeneratedText;
              copy[assistantIndex].modelUsed = finalModel;
            }
            return copy;
          });
        }
      });

      // Save complete messages to Firestore/Local
      const finalizedMessages = [
        ...newMessages,
        { role: "model", content: fullGeneratedText, modelUsed: finalModel }
      ];
      setMessages(finalizedMessages);
      await saveSessionMessages(currentChatId, finalizedMessages, user?.uid);

    } catch (err) {
      if (err.name === "AbortError") {
        const abortedMessages = [
          ...newMessages,
          { role: "model", content: fullGeneratedText + "\n\n*[Generasi dihentikan]*", modelUsed: finalModel }
        ];
        setMessages(abortedMessages);
        await saveSessionMessages(currentChatId, abortedMessages, user?.uid);
      } else {
        const errorMessages = [
          ...newMessages,
          { role: "model", content: err.message || "Terjadi gangguan server.", isError: true, modelUsed: finalModel }
        ];
        setMessages(errorMessages);
        await saveSessionMessages(currentChatId, errorMessages, user?.uid);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast("Jawaban disalin ke clipboard!"));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-darkest text-slate-100">
      
      {/* Sidebar with Chat History */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenFirebaseModal={() => openFirebaseModal()}
        onOpenAuthModal={() => openAuthModal()}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* Top Header */}
        <Header
          selectedFaculty={selectedFaculty}
          onSelectFaculty={setSelectedFaculty}
          currentMode={currentMode}
          onSetMode={setCurrentMode}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        />

        {/* Chat Messages Viewport */}
        <main
          ref={chatScrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 max-w-4xl mx-auto w-full pb-36 md:pb-6"
        >
          {messages.length === 0 ? (
            <WelcomeHero
              currentMode={currentMode}
              onSetMode={setCurrentMode}
              onSelectPrompt={(promptText) => handleSubmitMessage(promptText)}
            />
          ) : (
            <ChatList
              messages={messages}
              isGenerating={isGenerating}
              activeModelName={activeModelName}
              onCopyText={copyToClipboard}
            />
          )}
        </main>

        {/* Bottom Input Form */}
        <ChatInput
          input={input}
          setInput={setInput}
          isGenerating={isGenerating}
          onSubmit={() => handleSubmitMessage()}
          onStop={handleStop}
          currentMode={currentMode}
          onToggleMode={() => setCurrentMode(currentMode === "simple" ? "detail" : "simple")}
        />

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0a231f] border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl shadow-2xl text-xs font-semibold font-mono animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onShowToast={showToast}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        onShowToast={showToast}
      />

      <FirebaseModal
        isOpen={showFirebaseModal}
        onClose={closeFirebaseModal}
        onShowToast={showToast}
      />

    </div>
  );
}

