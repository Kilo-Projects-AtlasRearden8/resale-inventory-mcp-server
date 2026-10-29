import { z } from 'zod';

export const InventoryItemSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  cost: z.number().nonnegative('Cost must be zero or greater'),
  salePrice: z.number().nonnegative('Sale price must be zero or greater'),
  storageLocation: z.string().min(1, 'Storage location is required'),
});

export const AddItemInputSchema = z.object({
  item: InventoryItemSchema,
});

export const UpdateItemInputSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  changes: z.object({
    cost: z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    storageLocation: z.string().min(1).optional(),
  }),
});

export const RemoveItemInputSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
});

export const GetItemInputSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
});

export const ToolNameSchema = z.enum([
  'add_item',
  'get_item',
  'list_items',
  'update_item',
  'remove_item',
]);

const InventoryItemJsonSchema = {
  type: 'object',
  required: ['sku', 'cost', 'salePrice', 'storageLocation'],
  properties: {
    sku: { type: 'string', minLength: 1 },
    cost: { type: 'number', minimum: 0 },
    salePrice: { type: 'number', minimum: 0 },
    storageLocation: { type: 'string', minLength: 1 },
  },
  additionalProperties: false,
};

export const ToolSchemaList = [
  {
    name: 'add_item',
    description: 'Add a new reselling inventory item (SKU, cost, sale price, storage location).',
    inputSchema: {
      type: 'object',
      required: ['item'],
      properties: {
        item: InventoryItemJsonSchema,
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_item',
    description: 'Get a single inventory item by SKU.',
    inputSchema: {
      type: 'object',
      required: ['sku'],
      properties: {
        sku: { type: 'string', minLength: 1 },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'list_items',
    description: 'List all inventory items.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: 'update_item',
    description: 'Update an existing inventory item by SKU.',
    inputSchema: {
      type: 'object',
      required: ['sku'],
      properties: {
        sku: { type: 'string', minLength: 1 },
        changes: {
          type: 'object',
          properties: {
            cost: { type: 'number', minimum: 0 },
            salePrice: { type: 'number', minimum: 0 },
            storageLocation: { type: 'string', minLength: 1 },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'remove_item',
    description: 'Remove an inventory item by SKU.',
    inputSchema: {
      type: 'object',
      required: ['sku'],
      properties: {
        sku: { type: 'string', minLength: 1 },
      },
      additionalProperties: false,
    },
  },
];
