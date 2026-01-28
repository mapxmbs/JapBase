/**
 * @package @japbase/contracts
 * @file index.ts
 * 
 * Barrel export para todos os contratos de integração entre sistemas.
 * 
 * Sistemas devem importar apenas tipos deste pacote, nunca código de negócio
 * de outros sistemas diretamente.
 */

// JapImport contracts
export * from './japimport/api';
export * from './japimport/data-products';

// Shared contracts
export * from './shared';
