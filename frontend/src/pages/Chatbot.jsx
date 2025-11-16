import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "../components/Chatbot/ChatbotIcon";
import ChatForm from "../components/Chatbot/ChatForm";
import ChatMessage from "../components/Chatbot/ChatMessage";
import { companyInfo } from "../companyinfo.js";
import "../styles/Chatbot.css";




const Chatbot = () => {
const chatBodyRef = useRef();
const [showChatbot, setShowChatbot] = useState(false);
const [chatHistory, setChatHistory] = useState([
  {
    hideInChat: true,
    role: "model",
    text: companyInfo,
  },
]);




// Generate response from Gemini API
const generateBotResponse = async (history) => {
  // Add "Thinking..." placeholder
  setChatHistory((prev) => [...prev, { role: "model", text: "Thinking..." }]);




  // Format chat history
  const formattedHistory = history.map(({ role, text }) => ({
    role,
    parts: [{ text }],
  }));




  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: formattedHistory }),
  };




  try {
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);




    if (!response.ok) {
      // Sometimes error response has no JSON
      const text = await response.text();
      throw new Error(text || "Something went wrong!");
    }




    const data = await response.json();




    const apiResponseText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        .trim() || "Sorry, I didn’t get that.";




    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text: apiResponseText },
    ]);
  } catch (error) {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text: error.message, isError: true },
    ]);
  }
};




// Auto-scroll chat to bottom
useEffect(() => {
  if (chatBodyRef.current) {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }
}, [chatHistory]);




return (
  <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
    <button
      onClick={() => setShowChatbot((prev) => !prev)}
      id="chatbot-toggler"
    >
      <span className="material-symbols-rounded">mode_comment</span>
      <span className="material-symbols-rounded">close</span>
    </button>




    <div className="chatbot-popup">
      {/* Chatbot Header */}
      <div className="chat-header">
        <div className="header-info">
          <ChatbotIcon />
          <h2 className="logo-text">Koky</h2>
        </div>
        <button
          onClick={() => setShowChatbot((prev) => !prev)}
          className="material-symbols-rounded"
        >
          keyboard_arrow_down
        </button>
      </div>




      {/* Chatbot Body */}
      <div ref={chatBodyRef} className="chat-body">
        <div className="message bot-message">
          <ChatbotIcon />
          <p className="message-text">
            Hey there <br /> How can I help you today?
          </p>
        </div>
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>




      {/* Chatbot Footer */}
      <div className="chat-footer">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </div>
    </div>
  </div>
);
};




export default Chatbot;

