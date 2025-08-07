import React from "react";
import { DebugProvider } from "./contexts/DebugContext";
import { SharedStateProvider } from "./contexts/SharedStateContext";
import { ChatProvider } from "./contexts/ChatContext";
import { BubbleViewProvider } from "./contexts/BubbleViewContext";
import { App as ClippyApp } from "./components/App";

export function ClippyAppWrapper() {
  return (
    <DebugProvider>
      <SharedStateProvider>
        <ChatProvider>
          <BubbleViewProvider>
            <ClippyApp />
          </BubbleViewProvider>
        </ChatProvider>
      </SharedStateProvider>
    </DebugProvider>
  );
}
