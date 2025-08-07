import React, { useRef, useEffect } from 'react';
import { useChat } from './contexts/ChatContext';
import styles from './Chat.module.css';
import questionIcon from './images/icons/question.png';
import defaultClippy from './images/animations/Default.png';

export default function Chat() {
  const { messages, sendMessage, abortCurrent, isMessageLimitReached } = useChat();
  const listRef = useRef<HTMLDivElement>(null);

  // autoscroll...
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className={styles.chat}>
      <div className={styles.messages} ref={listRef}>
        {messages.map((m: { id: string; role: string; content: string }) => (
          <div key={m.id} className={styles.messageRow}>
            <img
              src={m.role === 'user' ? questionIcon : defaultClippy}
              alt={m.role === 'user' ? 'You' : 'Clippy'}
              className={styles.messageIcon}
            />
            <div className={styles.messageContent}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          if (isMessageLimitReached) return;
          const field = e.currentTarget.elements.namedItem(
            'prompt'
          ) as HTMLInputElement;
          const text = field.value.trim();
          if (text) sendMessage(text);
          e.currentTarget.reset();
        }}
      >
        <input
          type="text"
          name="prompt"
          placeholder={isMessageLimitReached ? "Límite de mensajes alcanzado" : "Type a message, press Enter to send…"}
          autoComplete="off"
          disabled={isMessageLimitReached}
          style={isMessageLimitReached ? { backgroundColor: '#f0f0f0', color: '#999', cursor: 'not-allowed' } : {}}
        />
        <button type="submit" disabled={isMessageLimitReached} style={isMessageLimitReached ? { backgroundColor: '#ccc', color: '#999', cursor: 'not-allowed' } : {}}>Send</button>
        <button type="button" onClick={abortCurrent} disabled={isMessageLimitReached} style={isMessageLimitReached ? { backgroundColor: '#ccc', color: '#999', cursor: 'not-allowed' } : {}}>
          Abort
        </button>
      </form>
    </div>
  );
}