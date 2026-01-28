'use client';

import React from "react";
import { useState, useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { usePiAuthSimple } from "./use-pi-auth-simple";
import { APP_CONFIG } from "@/lib/app-config";

// Helper function to create messages
const createMessage = (
  text: Message["text"],
  sender: Message["sender"],
  id?: Message["id"]
): Message => ({
  id: id || Date.now().toString(),
  text,
  sender,
  timestamp: new Date(),
});

export const useChatbot = () => {
  const { isAuthenticated, authMessage, piAccessToken, error } =
    usePiAuthSimple();

  const [messages, setMessages] = useState<Message[]>([
    createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1"),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showThinking = () => {
    const thinkingMessage = createMessage("Thinking... (0)", "ai", "thinking");
    setMessages((prev) => [...prev, thinkingMessage]);

    let seconds = 0;
    thinkingTimerRef.current = setInterval(() => {
      seconds += 1;
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === "thinking"
            ? { ...msg, text: `Thinking... (${seconds})` }
            : msg
        )
      );
    }, 1000);
  };

  const hideThinking = () => {
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== "thinking"));
  };

  const sendMessage = async () => {
    if (!isAuthenticated || !piAccessToken || !input.trim()) return;

    const userMessage = createMessage(input.trim(), "user");
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    showThinking();

    try {
      // 간단한 응답 로직 (백엔드 없이 작동)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      hideThinking();

      const responses = [
        "안녕하세요! XPI Token에 대해 궁금한 점이 있으신가요?",
        "토큰 발행을 원하시면 상단의 코인 아이콘을 클릭해주세요.",
        "Pi Network 테스트넷에서 안전하게 테스트하실 수 있습니다.",
        "무엇을 도와드릴까요?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botMessage = createMessage(randomResponse, "ai");
      setMessages((prev) => [...prev, botMessage]);
      
    } catch (error) {
      hideThinking();
      const errorMessage = createMessage("메시지 전송에 실패했습니다.", "ai");
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    messages,
    input,
    isLoading,
    isAuthenticated,
    authMessage,
    error,

    // Actions
    sendMessage,
    handleKeyPress,
    handleInputChange,
  };
};
