// Tipos de niveles de log
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';

// Interfaz para un log
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
}

// Almacén de logs en memoria
const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

// Configuración
const config = {
  consoleOutput: true,
  storeInMemory: true,
  logLevel: 'INFO' as LogLevel
};

// Función para determinar si un nivel debe ser logueado
const shouldLog = (level: LogLevel): boolean => {
  const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];
  const configIndex = levels.indexOf(config.logLevel);
  const levelIndex = levels.indexOf(level);
  
  return levelIndex >= configIndex;
};

// Función principal de logging
export const log = (
  level: LogLevel, 
  message: string, 
  context?: string, 
  data?: any
): LogEntry | null => {
  if (!shouldLog(level)) return null;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    data
  };

  // Añadir al almacén en memoria si está habilitado
  if (config.storeInMemory) {
    logs.push(entry);
    // Mantener un tamaño máximo
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
  }

  // Salida a consola si está habilitado
  if (config.consoleOutput) {
    const styles = {
      INFO: 'color: #3182ce; font-weight: bold;',
      WARNING: 'color: #dd6b20; font-weight: bold;',
      ERROR: 'color: #e53e3e; font-weight: bold;',
      DEBUG: 'color: #718096; font-weight: bold;'
    };

    console.log(
      `%c[${level}]%c ${context ? `[${context}]` : ''} ${message}`,
      styles[level],
      'color: inherit',
      data || ''
    );
  }

  return entry;
};

// Funciones de conveniencia para cada nivel
export const logInfo = (message: string, context?: string, data?: any): LogEntry | null => 
  log('INFO', message, context, data);

export const logWarning = (message: string, context?: string, data?: any): LogEntry | null => 
  log('WARNING', message, context, data);

export const logError = (message: string, context?: string, data?: any): LogEntry | null => 
  log('ERROR', message, context, data);

export const logDebug = (message: string, context?: string, data?: any): LogEntry | null => 
  log('DEBUG', message, context, data);

// Obtener todos los logs
export const getLogs = (): LogEntry[] => [...logs];

// Filtrar logs por nivel
export const getLogsByLevel = (level: LogLevel): LogEntry[] => 
  logs.filter(log => log.level === level);

// Filtrar logs por contexto
export const getLogsByContext = (context: string): LogEntry[] => 
  logs.filter(log => log.context === context);

// Limpiar todos los logs
export const clearLogs = (): void => {
  logs.length = 0;
};

// Exportar configuración
export const setLogLevel = (level: LogLevel): void => {
  config.logLevel = level;
};

export const enableConsoleOutput = (enable: boolean): void => {
  config.consoleOutput = enable;
};

export const enableMemoryStorage = (enable: boolean): void => {
  config.storeInMemory = enable;
};

export default {
  log,
  logInfo,
  logWarning,
  logError,
  logDebug,
  getLogs,
  getLogsByLevel,
  getLogsByContext,
  clearLogs,
  setLogLevel,
  enableConsoleOutput,
  enableMemoryStorage
};