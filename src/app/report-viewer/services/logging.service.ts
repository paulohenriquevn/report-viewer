import { Injectable } from '@angular/core';
import { environment } from '../../../environment';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    private currentLogLevel: LogLevel = environment.production 
        ? LogLevel.ERROR 
        : LogLevel.DEBUG;

    /**
     * Define o nível de log
     * @param level Nível de log
     */
    setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }

    /**
     * Log de erro
     * @param message Mensagem de erro
     * @param context Contexto adicional
     */
    error(message: string, context?: any): void {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(
                `[ERROR] ${message}`, 
                context ? context : ''
            );
            this.reportToErrorTracking(message, context);
        }
    }

    /**
     * Log de aviso
     * @param message Mensagem de aviso
     * @param context Contexto adicional
     */
    warn(message: string, context?: any): void {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(
                `[WARN] ${message}`, 
                context ? context : ''
            );
        }
    }

    /**
     * Log de informação
     * @param message Mensagem informativa
     * @param context Contexto adicional
     */
    info(message: string, context?: any): void {
        if (this.shouldLog(LogLevel.INFO)) {
            console.log(
                `[INFO] ${message}`, 
                context ? context : ''
            );
        }
    }

    /**
     * Log de depuração
     * @param message Mensagem de depuração
     * @param context Contexto adicional
     */
    debug(message: string, context?: any): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(
                `[DEBUG] ${message}`, 
                context ? context : ''
            );
        }
    }

    /**
     * Verifica se deve fazer log baseado no nível atual
     * @param level Nível de log a ser verificado
     * @returns Booleano indicando se deve fazer log
     */
    private shouldLog(level: LogLevel): boolean {
        const logLevels = [
            LogLevel.ERROR, 
            LogLevel.WARN, 
            LogLevel.INFO, 
            LogLevel.DEBUG
        ];
        return logLevels.indexOf(level) <= logLevels.indexOf(this.currentLogLevel);
    }

    /**
     * Reporta erro para serviço de rastreamento
     * @param message Mensagem de erro
     * @param context Contexto do erro
     */
    private reportToErrorTracking(message: string, context?: any): void {
        // Implementação de integração com serviço de rastreamento de erros
        // Por exemplo: Sentry, LogRocket, etc.
        if (environment.production) {
            try {
                // Exemplo fictício - substitua pela sua solução de tracking
                // window.Sentry?.captureException(new Error(message), { extra: context });
            } catch (trackingError) {
                console.error('Erro ao reportar para serviço de tracking', trackingError);
            }
        }
    }
}