export interface PlayerCheckResult {
  valid: boolean;
  playerName?: string;
  error?: string;
}

export interface SupplierOrderResult {
  supplierRef: string;
  status: 'pending' | 'processing' | 'delivered' | 'failed';
  responseJson?: any;
  error?: string;
}

export interface SupplierProvider {
  checkPlayer(gameSlug: string, playerId: string, serverId?: string): Promise<PlayerCheckResult>;
  createOrder(
    supplierSku: string,
    playerId: string,
    serverId: string | undefined,
    internalRef: string,
  ): Promise<SupplierOrderResult>;
  getStatus(supplierRef: string): Promise<SupplierOrderResult>;
  getBalance(): Promise<{ balanceCents: number; currency: string }>;
}
