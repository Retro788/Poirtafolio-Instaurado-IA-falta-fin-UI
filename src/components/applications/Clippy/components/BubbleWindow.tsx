import React, { useCallback, useState } from "react";
import { useInitialWindowSize } from "../../../../hooks/useInitialWindowSize";
import Chat from "./Chat";
import { Settings } from "./Settings";
import { useBubbleView } from "../contexts/BubbleViewContext";
import { Chats } from "./Chats";
import { useChat } from "../contexts/ChatContext";

export interface BubbleProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Bubble({ className, style }: BubbleProps) {
  const { currentView, setCurrentView } = useBubbleView();
  const { setIsChatWindowOpen } = useChat();
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Usar el hook para dimensiones iniciales
  const { width, height } = useInitialWindowSize({
    defaultWidth: 400,
    defaultHeight: 500,
    maxWidth: 800,
    maxHeight: 800
  });

  const containerStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        ...style
      }
    : {
        width: width,
        height: height,
        margin: 0,
        overflow: "hidden",
        ...style
      };

  const chatStyle = {
    padding: "15px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-end",
    minHeight: "calc(100% - 35px)",
    overflowAnchor: "none" as const,
  };

  const scrollAnchoredAtBottomStyle = {
    display: "flex",
    flexDirection: "column-reverse" as const,
  };

  let content = null;

  if (currentView === "chat") {
    content = <Chat style={chatStyle} />;
  } else if (currentView.startsWith("settings")) {
    content = (
      <Settings
        onClose={() => {
          setIsChatWindowOpen(false);
          setCurrentView("chat");
        }}
      />
    );
  } else if (currentView === "chats") {
    content = (
      <Chats
        onClose={() => {
          setIsChatWindowOpen(false);
          setCurrentView("chat");
        }}
      />
    );
  }

  const handleSettingsClick = useCallback(() => {
    if (currentView.startsWith("settings")) {
      setCurrentView("chat");
    } else {
      setCurrentView("settings");
    }
  }, [setCurrentView, currentView]);

  const handleChatsClick = useCallback(() => {
    if (currentView === "chats") {
      setCurrentView("chat");
    } else {
      setCurrentView("chats");
    }
  }, [setCurrentView, currentView]);

  return (
    <div className={`bubble-container window window--clippy ${className || ''}`} style={containerStyle}>
      <div className="app-drag title-bar">
        <div className="title-bar-text">Chat with Clippy</div>
        <div className="title-bar-controls app-no-drag">
          <button
            style={{
              marginRight: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
            }}
            onClick={handleChatsClick}
          >
            Chats
          </button>
          <button
            style={{
              marginRight: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              display: "none",
              visibility: "hidden",
              pointerEvents: "none"
            }}
            onClick={handleSettingsClick}
          >
            Settings
          </button>
          <button
            aria-label="Minimize"
            onClick={() => {
              setIsChatWindowOpen(false);
              setCurrentView("chat");
            }}
          ></button>
          <button
            aria-label={isMaximized ? "Restore" : "Maximize"}
            onClick={() => setIsMaximized((m) => !m)}
          ></button>
          <button
            aria-label="Close"
            onClick={() => {
              setIsChatWindowOpen(false);
              setCurrentView("chat");
            }}
          ></button>
        </div>
      </div>
      <div
        className="window-content"
        style={currentView === "chat" ? scrollAnchoredAtBottomStyle : {}}
      >
        {content}
      </div>
    </div>
  );
}
