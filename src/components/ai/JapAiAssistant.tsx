'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import {
  shoppingData,
  priceComparisonData,
  importProcessesData,
  divergenciasData,
  getKPIData,
} from '@/data/mockData';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function JapAiAssistant() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o JapMind, seu assistente de IA. Como posso ajudar?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!mounted) {
    return null;
  }

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    // Status de Importação / PIMP
    if (lowerInput.includes('pimp') || lowerInput.includes('importação') || lowerInput.includes('importacao')) {
      const emTransito = importProcessesData.filter(
        (p) => !p.steps.every((s) => s.completed)
      );
      const proximo = emTransito[0];
      
      if (lowerInput.includes('quantos') || lowerInput.includes('quantidade')) {
        return `Atualmente temos ${emTransito.length} processos de importação em trânsito.`;
      }
      
      if (proximo) {
        const progresso = proximo.steps.filter((s) => s.completed).length;
        return `O ${proximo.numero} (${proximo.fornecedor}) está ${progresso}/4 etapas concluídas. Previsão de chegada: ${proximo.previsaoChegada}. Valor total: R$ ${proximo.valorTotal?.toLocaleString('pt-BR') || 'N/A'}.`;
      }
      
      return `Temos ${importProcessesData.length} processos de importação cadastrados. ${emTransito.length} ainda em trânsito.`;
    }

    // Preços / Comparação
    if (lowerInput.includes('preço') || lowerInput.includes('preco') || lowerInput.includes('preços') || lowerInput.includes('precos')) {
      const skuMatch = userInput.match(/\d{3}\/\d{2}R\d{2}/i);
      if (skuMatch) {
        const medida = skuMatch[0];
        const item = priceComparisonData.find((p) => p.medidaSku === medida);
        if (item) {
          const diffA = ((item.nossoPreco - item.concorrenteA) / item.concorrenteA) * 100;
          const diffB = ((item.nossoPreco - item.concorrenteB) / item.concorrenteB) * 100;
          return `O ${medida} está sendo vendido por R$ ${item.nossoPreco.toFixed(2)}. Comparado ao Concorrente A: ${diffA > 0 ? '+' : ''}${diffA.toFixed(1)}% (R$ ${item.concorrenteA.toFixed(2)}). Comparado ao Concorrente B: ${diffB > 0 ? '+' : ''}${diffB.toFixed(1)}% (R$ ${item.concorrenteB.toFixed(2)}). Margem atual: ${item.margem?.toFixed(1)}%.`;
        }
      }
      
      const maisCaro = priceComparisonData.reduce((max, item) => 
        item.nossoPreco > max.nossoPreco ? item : max
      );
      const maisBarato = priceComparisonData.reduce((min, item) => 
        item.nossoPreco < min.nossoPreco ? item : min
      );
      
      return `Temos ${priceComparisonData.length} produtos com comparação de preços. O mais caro é o ${maisCaro.medidaSku} (R$ ${maisCaro.nossoPreco.toFixed(2)}). O mais barato é o ${maisBarato.medidaSku} (R$ ${maisBarato.nossoPreco.toFixed(2)}).`;
    }

    // Estoque / SKU
    if (lowerInput.includes('estoque') || lowerInput.includes('stock') || lowerInput.includes('sku')) {
      const skuMatch = userInput.match(/sku\d{3}/i);
      if (skuMatch) {
        const sku = skuMatch[0].toUpperCase();
        const item = shoppingData.find((s) => s.sku.toUpperCase() === sku);
        if (item) {
          return `O ${item.sku} (${item.produto}) tem ${item.estoque} unidades em estoque. PIMP: ${item.pimp}. Média de venda: ${item.mediaVenda}/mês. Sugestão de compra: ${item.sugestao} unidades. Status: ${item.status === 'ok' ? 'Normal' : item.status === 'alerta' ? 'Atenção' : 'Crítico'}.`;
        }
      }
      
      const criticos = shoppingData.filter((s) => s.status === 'critico');
      const alertas = shoppingData.filter((s) => s.status === 'alerta');
      const totalEstoque = shoppingData.reduce((sum, item) => sum + item.estoque, 0);
      const totalSugestao = shoppingData.reduce((sum, item) => sum + item.sugestao, 0);
      
      return `Temos ${shoppingData.length} SKUs cadastrados. Estoque total: ${totalEstoque} unidades. ${criticos.length} SKUs em situação crítica, ${alertas.length} em alerta. Sugestão total de compra: ${totalSugestao} unidades.`;
    }

    // Divergências
    if (lowerInput.includes('divergência') || lowerInput.includes('divergencia') || lowerInput.includes('divergências') || lowerInput.includes('divergencias')) {
      const total = divergenciasData.reduce((sum, d) => sum + d.valor, 0);
      const maior = divergenciasData.reduce((max, d) => d.valor > max.valor ? d : max);
      
      return `Há ${divergenciasData.length} divergências pendentes, totalizando R$ ${total.toLocaleString('pt-BR')}. A maior é da ${maior.nfe} (${maior.fornecedor}) no valor de R$ ${maior.valor.toLocaleString('pt-BR')} - ${maior.tipo}.`;
    }

    // KPIs / Resumo
    if (lowerInput.includes('resumo') || lowerInput.includes('kpi') || lowerInput.includes('dashboard') || lowerInput.includes('visão') || lowerInput.includes('visao')) {
      const kpi = getKPIData();
      const totalEstoque = shoppingData.reduce((sum, item) => sum + item.estoque, 0);
      const totalSugestao = shoppingData.reduce((sum, item) => sum + (item.sugestao * (item.preco || 0)), 0);
      
      return `📊 RESUMO GERAL:\n\n• ${kpi.emTransito} processos de importação em trânsito\n• Sugestão de compra: R$ ${(totalSugestao / 1000000).toFixed(2)}M\n• ${kpi.divergencias} divergências ativas\n• ${shoppingData.length} SKUs cadastrados\n• Estoque total: ${totalEstoque} unidades\n• ${importProcessesData.length} processos PIMP cadastrados`;
    }

    // Fornecedores
    if (lowerInput.includes('fornecedor') || lowerInput.includes('fornecedores')) {
      const fornecedores = Array.from(new Set(shoppingData.map((s) => s.fornecedor).filter(Boolean)));
      return `Trabalhamos com ${fornecedores.length} fornecedores: ${fornecedores.join(', ')}.`;
    }

    // Ajuda / Comandos
    if (lowerInput.includes('ajuda') || lowerInput.includes('help') || lowerInput.includes('comandos') || lowerInput.includes('o que você')) {
      return `🤖 Eu posso ajudar com:\n\n• Status de importações (PIMP)\n• Informações de preços e comparação\n• Dados de estoque e SKUs\n• Divergências pendentes\n• Resumo geral (KPIs)\n• Informações sobre fornecedores\n\nExemplos: "Status do PIMP 2025/001", "Preço do 175/70R13", "Estoque do SKU001", "Quantas divergências?"`;
    }

    // Resposta padrão
    return `Entendi sua pergunta. Posso ajudar com:\n\n• Status de importações (PIMP)\n• Preços e comparação\n• Estoque e SKUs\n• Divergências\n• Resumo geral\n\nTente perguntar: "Quantos PIMPs em trânsito?", "Preço do 175/70R13", "Estoque do SKU001" ou "Resumo geral".`;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Resposta baseada nos dados reais
    setTimeout(() => {
      const responseText = generateAIResponse(currentInput);

      const aiMessage: Message = {
        id: Date.now(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botão Flutuante (FAB) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#000000] text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#3E3F40] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isOpen ? 1 : [1, 1.05, 1],
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: isOpen ? 0 : Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <Bot size={24} strokeWidth={1.5} />
      </motion.button>

      {/* Janela de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-[#d4d4d4] flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-[#3E3F40] text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} strokeWidth={1.5} />
                <h3 className="font-bold">JapMind AI 🧠</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1 transition-colors"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Corpo do Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9f9f9]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-[#3E3F40] text-white'
                        : 'bg-white text-[#3E3F40] border border-[#d4d4d4]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#d4d4d4] bg-white rounded-b-lg">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta..."
                  className="flex-1 px-4 py-2 border border-[#d4d4d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E3F40] text-sm text-[#000000]"
                />
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-[#3E3F40] text-white rounded-lg flex items-center justify-center hover:bg-[#000000] transition-colors"
                >
                  <Send size={16} strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
