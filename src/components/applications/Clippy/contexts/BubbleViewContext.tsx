import React, { createContext, useContext, useEffect, useState } from "react";
import { clippyWebApi as clippyApi, electronAi } from "../api/clippyWebApi";
import type { BubbleView } from "../types/interfaces";

// Reexportamos BubbleView para que otros ficheros puedan importarlo
export type { BubbleView };

type BubbleViewContextType = {
  currentView: BubbleView;
  setCurrentView: (view: BubbleView) => void;
};

const BubbleViewContext = createContext<BubbleViewContextType | undefined>(
  undefined,
);

export const BubbleViewProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentView, setCurrentView] = useState<BubbleView>("chat");

  useEffect(() => {
    clippyApi.offSetBubbleView();
    clippyApi.onSetBubbleView((view: BubbleView) => {
      setCurrentView(view);
    });

    return () => {
      clippyApi.offSetBubbleView();
    };
  }, []);

  return (
    <BubbleViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </BubbleViewContext.Provider>
  );
};

export const useBubbleView = () => {
  const context = useContext(BubbleViewContext);
  if (context === undefined) {
    throw new Error("useBubbleView must be used within a BubbleViewProvider");
  }
  return context;
};
