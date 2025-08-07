import React, { useRef, useEffect } from 'react';
import { useChat } from './contexts/ChatContext';
import styles from './Chat.module.css';

export default function Chat() {
  const { messages, sendMessage, abortCurrent } = useChat();
  const listRef = useRef<HTMLDivElement>(null);

  // autoscroll...
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className={styles.chat}>
      <div className={styles.messages} ref={listRef}>
        {messages.map((m: { id: string; role: string; content: string }) => (
          <div key={m.id} className={styles[m.role]}>
            {m.content}
          </div>
        ))}
      </div>

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
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
          placeholder="Type a message, press Enter to send…"
          autoComplete="off"
        />
        <button type="submit">Send</button>
        <button type="button" onClick={abortCurrent}>
          Abort
        </button>
      </form>
    </div>
  );
}