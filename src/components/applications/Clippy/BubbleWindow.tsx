import React from 'react';
import Window from '../../os/Window';
import Chat from './components/Chat';

/** Ventana Clippy tamaño exacto */
export default function BubbleWindow() {
  return (
    <Window
      title="Chat with Clippy"
      className="window--clippy"
      initialSize={{ width: 460, height: 640 }}
      minSize={{ width: 380, height: 320 }}
    >
      <Chat />
    </Window>
  );
}