import React, { useRef, useEffect, FormEvent } from 'react';
import { useChat } from '../contexts/ChatContext';
import styles from './Chat.module.css';

/*  Tipo mínimo para render    */
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatProps {
  style?: React.CSSProperties;
}

const Chat: React.FC<ChatProps> = ({ style }) => {
  const { messages, sendMessage, abortCurrent, isMessageLimitReached } = useChat();
  const listRef = useRef<HTMLDivElement>(null);

  // autoscroll...
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('prompt') as HTMLInputElement;
    const text  = input.value.trim();
    if (text) sendMessage(text);
    e.currentTarget.reset();
  };

  return (
    <div className={styles.chat} style={style}>
      <div className={styles.messages} ref={listRef}>
        {messages.map((m: Message) => (
          <div key={m.id} className={styles[m.role]}>
            {m.content}
          </div>
        ))}
      </div>

      <form className={styles.inputRow} onSubmit={handleSubmit}>

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
};

export default Chat;
