import { SupplierProvider, PlayerCheckResult, SupplierOrderResult } from './supplier.interface.js';
import crypto from 'crypto';

export class MockSupplier implements SupplierProvider {
  async checkPlayer(gameSlug: string, playerId: string, serverId?: string): Promise<PlayerCheckResult> {
    if (!playerId || playerId.length < 3) {
      return { valid: false, error: 'Invalid player ID format' };
    }
    // Simulate lookup
    const mockNames = ['Sokha Gamer', 'Vimean Pro', 'Dara Legend', 'Chanborey KH', 'Khemara Play'];
    const randomName = mockNames[parseInt(playerId, 10) % mockNames.length] || 'Player_KH';
    return {
      valid: true,
      playerName: `${randomName} (${playerId}${serverId ? ` - ${serverId}` : ''})`,
    };
  }

  async createOrder(supplierSku: string, playerId: string, serverId: string | undefined, internalRef: string): Promise<SupplierOrderResult> {
    const supplierRef = `SUPP_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    return {
      supplierRef,
      status: 'delivered',
      responseJson: { success: true, sku: supplierSku, playerId, serverId, timestamp: new Date().toISOString() },
    };
  }

  async getStatus(supplierRef: string): Promise<SupplierOrderResult> {
    return {
      supplierRef,
      status: 'delivered',
      responseJson: { status: 'completed' },
    };
  }

  async getBalance(): Promise<{ balanceCents: number; currency: string }> {
    return { balanceCents: 500000, currency: 'USD' }; // $5,000.00
  }
}

export const mockSupplier = new MockSupplier();
