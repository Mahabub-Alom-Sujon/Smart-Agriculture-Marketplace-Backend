export const AUDIT_LOG_LEVEL = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
} as const;

export const AUDIT_LOG_ACTION = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
} as const;

export type IAuditLogLevel = typeof AUDIT_LOG_LEVEL[keyof typeof AUDIT_LOG_LEVEL];
export type IAuditLogAction = typeof AUDIT_LOG_ACTION[keyof typeof AUDIT_LOG_ACTION];
