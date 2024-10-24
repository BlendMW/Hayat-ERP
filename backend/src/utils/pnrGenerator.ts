import { customAlphabet } from 'nanoid';

const GDS_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding 0, 1, I, and O to avoid confusion
const PNR_LENGTH = 6;

export class PNRGenerator {
  private tenantPrefix: string;
  private nanoid: (size?: number) => string;

  constructor(tenantId: string) {
    this.tenantPrefix = this.generateTenantPrefix(tenantId);
    this.nanoid = customAlphabet(GDS_ALPHABET, PNR_LENGTH - 1);
  }

  private generateTenantPrefix(tenantId: string): string {
    // Generate a unique single-character prefix for each tenant
    // This is a simplified example; in a real-world scenario, you might want to use a more sophisticated method
    return tenantId.charAt(0).toUpperCase();
  }

  generatePNR(): string {
    const uniquePart = this.nanoid();
    return `${this.tenantPrefix}${uniquePart}`;
  }
}
