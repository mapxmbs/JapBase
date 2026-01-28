'use client';

import { useState } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou o assistente de IA do JapBase. Posso ajudar você a encontrar informações sobre PIMPs, vendas, distribuição e muito mais. Faça uma pergunta!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO FUTURO: Integrar com API de IA (OpenAI, Anthropic, etc.) e backend do JapBase
    // Por enquanto, respostas mock baseadas em palavras-chave e algumas aleatórias
    setTimeout(() => {
      const response = generateMockResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800 + Math.random() * 700); // Simula tempo de resposta variável
  };

  const generateMockResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Respostas específicas baseadas em palavras-chave
    if (lowerQuestion.includes('pimp') || lowerQuestion.includes('importação') || lowerQuestion.includes('import')) {
      const responses = [
        'Atualmente temos 18 PIMPs ativos em trânsito e 42 PIMPs finalizados este mês. O PIMP-2025-001 está previsto para chegar em 05/02/2025. Posso mostrar mais detalhes se precisar.',
        'Temos 18 processos de importação ativos. Os três mais próximos de chegada são: PIMP-2025-001 (15 dias), PIMP-2025-015 (22 dias) e PIMP-2025-008 (28 dias).',
        'O status atual dos PIMPs: 18 ativos, sendo 12 em trânsito, 4 em porto e 2 aguardando embarque. Total de 42 finalizados no mês.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('venda') || lowerQuestion.includes('faturamento') || lowerQuestion.includes('receita')) {
      const responses = [
        'O faturamento total do mês atual é de R$ 33.5M, representando 96% da meta mensal. As vendas estão 12% acima do mês anterior.',
        'Faturamento consolidado: R$ 33.5 milhões este mês. Crescimento de 12% comparado ao mês anterior. Meta de R$ 35M está 96% atingida.',
        'Vendas em alta! R$ 33.5M faturados, com destaque para o canal atacado (R$ 18.2M) e varejo (R$ 15.3M).',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('meta') || lowerQuestion.includes('atingimento') || lowerQuestion.includes('performance')) {
      const responses = [
        'O atingimento médio das metas é de 94%. A equipe de Manaus Centro está com 87% e Manaus Cidade Nova com 90%.',
        'Performance geral: 94% de atingimento. Melhor desempenho: Porto Velho (100%), seguido por Boa Vista (98%).',
        'Metas do mês: 96% de faturamento atingido (R$ 33.5M de R$ 35M). Equipes com melhor performance: Ana Silva (120%) e Pedro Lima (100%).',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('distribuição') || lowerQuestion.includes('estoque') || lowerQuestion.includes('logística')) {
      const responses = [
        'Temos 2 sugestões de distribuição pendentes de aprovação. A prioridade alta é para Pneu 205/55R16, movendo 500 unidades de Manaus Centro para Cidade Nova.',
        'Sistema de distribuição identificou 2 oportunidades de otimização. Estoque atual: 12.500 unidades distribuídas em 12 filiais.',
        'Logística: 2 sugestões de redistribuição pendentes. Economia estimada de R$ 45K com as otimizações propostas.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('auditoria') || lowerQuestion.includes('glosa') || lowerQuestion.includes('divergência')) {
      const responses = [
        'Existem 2 divergências pendentes de auditoria, totalizando R$ 14.050,00 em valores divergentes. A análise comercial está em andamento.',
        'Auditoria: 2 casos pendentes identificados. Valor total divergente: R$ 14.050,00. Equipe financeira analisando.',
        'Status da auditoria: 2 glosas pendentes (R$ 14.050,00). Taxa de conformidade: 98,5% das notas fiscais estão corretas.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('dólar') || lowerQuestion.includes('cotação') || lowerQuestion.includes('câmbio')) {
      const responses = [
        'A cotação atual do dólar PTAX é R$ 5.28. Variação de -0.15% nas últimas 24 horas. Última atualização há 5 minutos.',
        'Dólar hoje: R$ 5.28. Tendência de queda leve (-0.15%). Recomendação: acompanhar para próximas importações.',
        'Cotação do dólar: R$ 5.28. Estável nas últimas horas. Impacto estimado nos PIMPs ativos: R$ 2.3M em valor total.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('cliente') || lowerQuestion.includes('clientes')) {
      const responses = [
        'Temos 1.247 clientes ativos este mês. Os principais são: Auto Peças XYZ (R$ 2.5M), Distribuidora ABC (R$ 1.8M) e Revendedora 123 (R$ 1.2M).',
        'Base de clientes: 1.247 ativos. Crescimento de 8% vs mês anterior. Novos clientes: 45 cadastrados este mês.',
        'Clientes ativos: 1.247. Ticket médio: R$ 36.2K. Maior faturamento: Auto Peças XYZ com R$ 2.5M no período.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lowerQuestion.includes('produto') || lowerQuestion.includes('produtos') || lowerQuestion.includes('estoque')) {
      const responses = [
        'Catálogo atual: 1.850 produtos cadastrados. 1.720 com fichas técnicas completas. 130 pendentes de documentação.',
        'Produtos mais vendidos: Pneu 205/55R16 (2.500 unidades), Pneu 185/65R15 (1.800 unidades) e Pneu 225/50R17 (1.200 unidades).',
        'Estoque total: 12.500 unidades distribuídas. Produtos com maior giro: Pneu 205/55R16 e Pneu 185/65R15.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Respostas aleatórias para testar a serventia
    const randomResponses = [
      'Entendi sua pergunta. Estou processando os dados do JapBase. Em breve, quando a integração com o backend estiver completa, poderei fornecer informações precisas e em tempo real sobre todos os módulos.',
      'Essa é uma ótima pergunta! No momento estou trabalhando com dados de demonstração. Quando conectado ao backend real, poderei dar respostas mais detalhadas e atualizadas.',
      'Compreendo sua dúvida. O sistema está em fase de desenvolvimento e em breve terá acesso completo aos dados do Sispro e outros sistemas integrados.',
      'Boa pergunta! Estou aprendendo sobre o JapBase. Quando totalmente integrado, poderei ajudar com análises mais profundas e insights estratégicos.',
      'Interessante! No momento, estou usando dados mock para demonstração. A integração completa permitirá respostas mais precisas e contextualizadas.',
      'Entendi. Estou aqui para ajudar! Quando o sistema estiver totalmente operacional, poderei cruzar dados de todos os módulos para dar insights mais valiosos.',
      'Ótima questão! Estou processando sua solicitação. Com a integração completa, poderei fornecer análises mais detalhadas e recomendações estratégicas.',
      'Compreendo. Estou trabalhando para melhorar minhas respostas. Em breve, com acesso aos dados reais, poderei ser muito mais útil para a diretoria.',
    ];

    // 30% de chance de resposta aleatória, 70% de resposta padrão
    if (Math.random() < 0.3) {
      return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }

    return 'Entendi sua pergunta. No momento, estou processando dados mock. Em breve, quando a integração com o backend estiver completa, poderei fornecer informações precisas e em tempo real sobre todos os módulos do JapBase.';
  };

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-japura-black hover:bg-japura-dark text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-colors"
          title="Assistente de IA"
        >
          <Bot size={24} />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-japura-white rounded-japura shadow-2xl border-2 border-japura-black flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-japura-black p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-japura-white rounded-lg">
                  <Bot size={20} className="text-japura-black" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Assistente IA</h3>
                  <p className="text-xs text-gray-400">JapBase Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-japura-dark text-white'
                        : 'bg-gray-100 text-japura-black'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 size={16} className="animate-spin text-japura-dark" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre PIMPs, vendas, distribuição..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-japura-dark text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-japura-dark hover:bg-japura-black text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-japura-grey mt-2 italic">
                TODO: Integrar com API de IA e backend do JapBase
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
