import React from "react";
import ReactMarkdown from "react-markdown";
import questionIcon from "../images/icons/question.png";
import defaultClippy from "../images/animations/Default.png";
import type { ChatWithMessages } from "../types/interfaces";
import styles from "./Chat.module.css";

export interface Message {
  id: string;
  content?: string;
  children?: React.ReactNode;
  createdAt: number;
  sender: "user" | "clippy";
}

export function Message({ message }: { message: Message }) {
  return (
    <div
      className={`${styles.message} ${styles[`message-${message.sender}`]}`}
    >
      <img
        src={message.sender === "user" ? questionIcon : defaultClippy}
        alt={`${message.sender === "user" ? "You" : "Clippy"}`}
        style={{ width: "24px", height: "24px", marginRight: "8px" }}
      />
      <div className={styles["message-content"]}>
        {message.children ? (
          message.children
        ) : (
          <ReactMarkdown
            children={message.content ?? ""}
            components={{
              // ejemplo de tipado de `node`
              code({ node, inline, className, children, ...props }) {
                return <code {...props}>{children}</code>;
              },
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          />
        )}
      </div>
    </div>
  );
}
