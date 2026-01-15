'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle, ChevronDown, ChevronUp, Calendar, DollarSign, Package } from 'lucide-react';
import { importProcessesData, type ImportProcess, type ProcessStep } from '@/data/mockData';

const sampleProcesses = importProcessesData;

function ProgressStep({ step, isLast, index }: { step: ProcessStep; isLast: boolean; index: number }) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, type: 'spring' }}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            step.completed
              ? 'bg-[#3E3F40] border-[#3E3F40] text-white'
              : 'bg-white border-[#827f7f] text-[#827f7f]'
          }`}
        >
          {step.completed ? (
            <Check size={18} strokeWidth={2} />
          ) : (
            <Circle size={12} strokeWidth={2} fill="currentColor" />
          )}
        </motion.div>
        <span
          className={`mt-2 text-xs font-medium ${
            step.completed ? 'text-[#3E3F40]' : 'text-[#827f7f]'
          }`}
        >
          {step.label}
        </span>
      </div>
      {!isLast && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: step.completed ? 64 : 64 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={`h-0.5 mx-2 ${
            step.completed ? 'bg-[#3E3F40]' : 'bg-[#827f7f]'
          }`}
        />
      )}
    </div>
  );
}

export default function ImportTracker() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (numero: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(numero)) {
      newExpanded.delete(numero);
    } else {
      newExpanded.add(numero);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (process: ImportProcess) => {
    const completedSteps = process.steps.filter((s) => s.completed).length;
    if (completedSteps === process.steps.length) return 'green';
    if (completedSteps >= 2) return 'yellow';
    return 'red';
  };

  const getStatusLabel = (process: ImportProcess) => {
    const completedSteps = process.steps.filter((s) => s.completed).length;
    if (completedSteps === process.steps.length) return 'Concluído';
    if (completedSteps >= 2) return 'Em Andamento';
    return 'Iniciado';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {sampleProcesses.map((process, processIndex) => {
        const isExpanded = expandedItems.has(process.numero);
        const statusColor = getStatusColor(process);
        const statusLabel = getStatusLabel(process);
        const progress = (process.steps.filter((s) => s.completed).length / process.steps.length) * 100;

        return (
          <motion.div
            key={process.numero}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: processIndex * 0.1 }}
            whileHover={{ scale: 1.005, y: -2 }}
            className="bg-white border border-[#d4d4d4] rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#000000]">
                      {process.numero}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColor === 'green'
                          ? 'bg-green-100 text-green-700'
                          : statusColor === 'yellow'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#3E3F40] mb-3">
                    {process.fornecedor}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {process.valorTotal && (
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" strokeWidth={1.5} />
                        <div>
                          <p className="text-xs text-gray-500">Valor Total</p>
                          <p className="text-sm font-semibold text-[#000000]">
                            R$ {process.valorTotal.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                    {process.quantidadeItens && (
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-blue-600" strokeWidth={1.5} />
                        <div>
                          <p className="text-xs text-gray-500">Quantidade</p>
                          <p className="text-sm font-semibold text-[#000000]">
                            {process.quantidadeItens.toLocaleString('pt-BR')} itens
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-purple-600" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-gray-500">Previsão</p>
                        <p className="text-sm font-semibold text-[#000000]">
                          {process.previsaoChegada}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(process.numero)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
              </div>

              {/* Barra de Progresso Geral */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Progresso Geral</span>
                  <span className="text-xs font-semibold text-[#3E3F40]">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: processIndex * 0.1 + 0.2, duration: 0.5 }}
                    className={`h-3 rounded-full ${
                      statusColor === 'green'
                        ? 'bg-green-500'
                        : statusColor === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Barra de Progresso Detalhada */}
              <div className="flex items-center">
                {process.steps.map((step, index) => (
                  <ProgressStep
                    key={step.label}
                    step={step}
                    isLast={index === process.steps.length - 1}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Detalhes Expandidos */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[#d4d4d4] bg-gray-50"
                >
                  <div className="p-6">
                    <h4 className="text-sm font-bold text-[#000000] mb-4">Detalhes do Processo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {process.steps.map((step, idx) => (
                        <div
                          key={step.label}
                          className={`p-3 rounded-lg border-2 ${
                            step.completed
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {step.completed ? (
                              <Check size={16} className="text-green-600" strokeWidth={2} />
                            ) : (
                              <Circle size={16} className="text-gray-400" strokeWidth={2} />
                            )}
                            <span className="text-sm font-semibold text-[#000000]">
                              {step.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {step.completed
                              ? 'Etapa concluída com sucesso'
                              : 'Aguardando conclusão'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
