/* Defines the User Interfices */
export interface User {
    id: string; 
    provider: string; 
    providerId: string; 
    isAdmin: string; 
    userName: string; 
    normalizedUserName: string; 
    email: string; 
    normalizedEmail: string; 
    emailConfirmed: boolean; 
    passwordHash: string; 
    securityStamp: string; 
    concurrencyStamp: string; 
    phoneNumber: string; 
    phoneNumberConfirmed: boolean; 
    twoFactorEnabled: boolean; 
    lockoutEnd: Date; 
    lockoutEnabled: boolean; 
    accessFailedCount: number; 
  }