export type UserRole = 'SUPER_ADMIN' | 'MANAGER' | 'BILLING_STAFF' | 'PRIZE_COUNTER_STAFF';

export interface AdminUserPermissions {
  canManagePrizes: boolean;
  canGenerateTokens: boolean;
  canFulfillClaims: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
}

export class RBACService {
  static getPermissions(role: UserRole): AdminUserPermissions {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          canManagePrizes: true,
          canGenerateTokens: true,
          canFulfillClaims: true,
          canViewAnalytics: true,
          canManageSettings: true
        };
      case 'MANAGER':
        return {
          canManagePrizes: true,
          canGenerateTokens: true,
          canFulfillClaims: true,
          canViewAnalytics: true,
          canManageSettings: false
        };
      case 'PRIZE_COUNTER_STAFF':
        return {
          canManagePrizes: false,
          canGenerateTokens: false,
          canFulfillClaims: true,
          canViewAnalytics: false,
          canManageSettings: false
        };
      case 'BILLING_STAFF':
      default:
        return {
          canManagePrizes: false,
          canGenerateTokens: true,
          canFulfillClaims: false,
          canViewAnalytics: false,
          canManageSettings: false
        };
    }
  }
}
