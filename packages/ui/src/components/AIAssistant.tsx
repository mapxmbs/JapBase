/**
 * @package @japbase/ui
 * @component AIAssistant
 * 
 * Assistente de IA global do JapBase.
 * Disponível em todas as páginas do Hub para suporte contextual.
 */

'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-japura-primary text-white rounded-full shadow-lg hover:bg-japura-dark transition-colors z-50"
          title="Abrir Assistente de IA"
        >
          <MessageCircle size={24} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-japura-white rounded-lg shadow-xl border border-gray-300 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-japura-black">Assistente de IA</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="text-sm text-japura-grey text-center py-8">
                Olá! Como posso ajudar você hoje?
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      // TODO: Implementar envio de mensagem
                      setMessage('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (message.trim()) {
                      // TODO: Implementar envio de mensagem
                      setMessage('');
                    }
                  }}
                  className="p-2 bg-japura-primary text-white rounded-lg hover:bg-japura-dark transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
