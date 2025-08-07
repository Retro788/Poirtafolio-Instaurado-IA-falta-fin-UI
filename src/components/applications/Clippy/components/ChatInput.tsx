import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../contexts/ChatContext";
import styles from "./Chat.module.css";
export type ChatInputProps = {
  onSend: (message: string) => void;
  onAbort: () => void;
};

export function ChatInput({ onSend, onAbort }: ChatInputProps) {
  const { status } = useChat();
  const [message, setMessage] = useState("");
  const { isModelLoaded } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();

    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage("");
    }
  }, [message, onSend]);

  const handleAbort = useCallback(() => {
    setMessage("");
    onAbort();
  }, [onAbort]);

  const handleSendOrAbort = useCallback(() => {
    if (status === "responding") {
      handleAbort();
    } else {
      handleSend();
    }
  }, [status, handleSend, handleAbort]);

  const buttonStyle: React.CSSProperties = {
    alignSelf: "flex-end",
    height: "23px",
  };

  useEffect(() => {
    if (isModelLoaded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isModelLoaded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const trimmedMessage = message.trim();

      if (trimmedMessage) {
        onSend(trimmedMessage);
        setMessage("");
      }

      e.preventDefault();
      e.stopPropagation();
    }
  };

  const placeholder = isModelLoaded
    ? "Type a message, press Enter to send..."
    : "This is your chat input, we're just waiting for a model to load...";

  return (
    <div className={styles["input-container"]}>
      <textarea
        rows={1}
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isModelLoaded}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles["input-field"]}
      />
      <button
        disabled={!isModelLoaded}
        className={styles["send-button"]}
        onClick={handleSendOrAbort}
      >
        {status === "responding" ? "Abort" : "Send"}
      </button>
    </div>
  );
}
