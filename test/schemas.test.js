import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  InventoryItemSchema,
  AddItemInputSchema,
  GetItemInputSchema,
  RemoveItemInputSchema,
  UpdateItemInputSchema,
  ToolNameSchema,
  ToolSchemaList,
} from '../src/schema.js';

describe('InventoryItemSchema', () => {
  it('accepts a valid inventory item', () => {
    const result = InventoryItemSchema.safeParse({
      sku: 'BOOK-001',
      cost: 5.0,
      salePrice: 12.99,
      storageLocation: 'Shelf A-1',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sku).toBe('BOOK-001');
      expect(result.data.cost).toBe(5);
      expect(result.data.salePrice).toBe(12.99);
      expect(result.data.storageLocation).toBe('Shelf A-1');
    }
  });

  it('rejects missing SKU', () => {
    const result = InventoryItemSchema.safeParse({
      cost: 5,
      salePrice: 10,
      storageLocation: 'Shelf A-1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty SKU', () => {
    const result = InventoryItemSchema.safeParse({
      sku: '',
      cost: 5,
      salePrice: 10,
      storageLocation: 'Shelf A-1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative cost', () => {
    const result = InventoryItemSchema.safeParse({
      sku: 'BOOK-001',
      cost: -1,
      salePrice: 10,
      storageLocation: 'Shelf A-1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative sale price', () => {
    const result = InventoryItemSchema.safeParse({
      sku: 'BOOK-001',
      cost: 5,
      salePrice: -2,
      storageLocation: 'Shelf A-1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing storage location', () => {
    const result = InventoryItemSchema.safeParse({
      sku: 'BOOK-001',
      cost: 5,
      salePrice: 10,
    });
    expect(result.success).toBe(false);
  });

  it('allows zero cost and sale price', () => {
    const result = InventoryItemSchema.safeParse({
      sku: 'FREE-001',
      cost: 0,
      salePrice: 0,
      storageLocation: 'Free bin',
    });
    expect(result.success).toBe(true);
  });
});

describe('AddItemInputSchema', () => {
  it('accepts valid add item input', () => {
    const result = AddItemInputSchema.safeParse({
      item: {
        sku: 'BOOK-001',
        cost: 5,
        salePrice: 12.99,
        storageLocation: 'Shelf A-1',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing item', () => {
    const result = AddItemInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('GetItemInputSchema', () => {
  it('accepts valid get item input', () => {
    expect(GetItemInputSchema.safeParse({ sku: 'BOOK-001' }).success).toBe(true);
  });

  it('rejects missing SKU', () => {
    expect(GetItemInputSchema.safeParse({}).success).toBe(false);
  });

  it('rejects empty SKU', () => {
    expect(GetItemInputSchema.safeParse({ sku: '' }).success).toBe(false);
  });
});

describe('RemoveItemInputSchema', () => {
  it('accepts valid remove item input', () => {
    expect(RemoveItemInputSchema.safeParse({ sku: 'BOOK-001' }).success).toBe(true);
  });

  it('rejects missing SKU', () => {
    expect(RemoveItemInputSchema.safeParse({}).success).toBe(false);
  });
});

describe('UpdateItemInputSchema', () => {
  it('accepts valid update item input with all fields', () => {
    const result = UpdateItemInputSchema.safeParse({
      sku: 'BOOK-001',
      changes: { cost: 6, salePrice: 14, storageLocation: 'Shelf B-2' },
    });
    expect(result.success).toBe(true);
  });

  it('accepts partial changes', () => {
    const result = UpdateItemInputSchema.safeParse({
      sku: 'BOOK-001',
      changes: { salePrice: 14 },
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing SKU', () => {
    expect(UpdateItemInputSchema.safeParse({ changes: {} }).success).toBe(false);
  });
});

describe('ToolNameSchema', () => {
  it('accepts all known tool names', () => {
    for (const name of ['add_item', 'get_item', 'list_items', 'update_item', 'remove_item']) {
      expect(ToolNameSchema.safeParse(name).success).toBe(true);
    }
  });

  it('rejects unknown tool names', () => {
    expect(ToolNameSchema.safeParse('delete_all').success).toBe(false);
  });
});

describe('ToolSchemaList', () => {
  it('contains all five tools with names, descriptions, and input schemas', () => {
    expect(ToolSchemaList).toHaveLength(5);
    const names = ToolSchemaList.map((t) => t.name);
    expect(names).toEqual(['add_item', 'get_item', 'list_items', 'update_item', 'remove_item']);
    for (const tool of ToolSchemaList) {
      expect(typeof tool.name).toBe('string');
      expect(typeof tool.description).toBe('string');
      expect(tool.description.length).toBeGreaterThan(0);
      expect(tool.inputSchema).toBeDefined();
    }
  });

  it('add_item input schema requires item object', () => {
    const addTool = ToolSchemaList.find((t) => t.name === 'add_item');
    expect(addTool.inputSchema.properties.item).toBeDefined();
    expect(addTool.inputSchema.required).toContain('item');
  });

  it('list_items input schema is an empty-object JSON schema', () => {
    const listTool = ToolSchemaList.find((t) => t.name === 'list_items');
    expect(listTool.inputSchema).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });
});
