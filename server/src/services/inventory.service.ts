import { PoolConnection } from 'mysql2/promise';
import { pool } from '../config/database';

export type InventoryReason = 'purchase' | 'sale' | 'return' | 'adjustment' | 'damage';

export const inventoryService = {
  async recordMovement(
    connection: PoolConnection,
    variantId: number,
    changeQuantity: number,
    reason: InventoryReason,
    referenceId?: number,
    notes?: string
  ) {
    // 1. Update stock in product_variants
    await connection.query(
      'UPDATE product_variants SET stock_quantity = GREATEST(0, stock_quantity + ?) WHERE id = ?',
      [changeQuantity, variantId]
    );

    // 2. Insert into inventory movement history
    await connection.query(
      `INSERT INTO inventory (variant_id, change_quantity, reason, reference_id, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [variantId, changeQuantity, reason, referenceId || null, notes || null]
    );
  },

  async adjustStock(variantId: number, quantity: number, reason: InventoryReason, notes?: string) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await this.recordMovement(connection, variantId, quantity, reason, undefined, notes);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};
