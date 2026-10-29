import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  addItem,
  findItemBySku,
  listItems,
  removeItem,
  updateItem,
} from './storage.js';
import {
  AddItemInputSchema,
  GetItemInputSchema,
  RemoveItemInputSchema,
  UpdateItemInputSchema,
  ToolSchemaList,
} from './schema.js';

const server = new Server(
  {
    name: 'resale-inventory-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: ToolSchemaList.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'add_item': {
        const { item } = AddItemInputSchema.parse(args);
        const created = addItem(item);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { ok: true, item: created },
                null,
                2
              ),
            },
          ],
        };
      }
      case 'get_item': {
        const { sku } = GetItemInputSchema.parse(args);
        const item = findItemBySku(sku);
        if (!item) {
          return {
            content: [{ type: 'text', text: JSON.stringify({ ok: false, error: `Item with SKU ${sku} not found` }) }],
            isError: true,
          };
        }
        return {
          content: [
            { type: 'text', text: JSON.stringify({ ok: true, item }, null, 2) },
          ],
        };
      }
      case 'list_items': {
        const items = listItems();
        return {
          content: [
            { type: 'text', text: JSON.stringify({ ok: true, count: items.length, items }, null, 2) },
          ],
        };
      }
      case 'update_item': {
        const { sku, changes } = UpdateItemInputSchema.parse(args);
        const updated = updateItem(sku, changes);
        return {
          content: [
            { type: 'text', text: JSON.stringify({ ok: true, item: updated }, null, 2) },
          ],
        };
      }
      case 'remove_item': {
        const { sku } = RemoveItemInputSchema.parse(args);
        removeItem(sku);
        return {
          content: [
            { type: 'text', text: JSON.stringify({ ok: true, sku }) },
          ],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ ok: false, error: err.message }) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
