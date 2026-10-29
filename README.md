# Resale Inventory MCP Server

A local-first Model Context Protocol (MCP) server for tracking reselling inventory
(eBay, Amazon, and beyond). It stores SKU, cost, sale price, and storage location
in a local JSON file, speaks over stdio, and needs no API keys or accounts.

Built and maintained by **Asdale Dynamics, LLC** — beginner-friendly AI education,
books, guides, and practical tools you can publish or sell. Learn more at
[dylanasdale.github.io](https://dylanasdale.github.io).

## What it does

This MCP server lets AI assistants and MCP clients manage a small reselling
inventory entirely on your machine. You can:

- Add an item (SKU, cost, sale price, storage location)
- Look up a single item by SKU
- List all items
- Update an item's cost, sale price, or storage location
- Remove an item by SKU

Everything is stored locally in `inventory.json`. Nothing leaves your computer,
and no API keys, secrets, or personal data are required or stored.

## Who this is for

Dylan Asdale is a registered nurse turned AI author and founder of Asdale
Dynamics, LLC (Indiana, formed Oct 2026). His book *The Massive AI Manual* and
hub site dylanasdale.github.io explain AI "like a friend would": plain English,
step by step, never condescending.

This server is part of the LLC's open-source tools and templates — practical,
tested, local-first software for resellers, authors, and small-business owners.

## Install

```bash
git clone https://github.com/yourname/resale-inventory-mcp-server.git
cd resale-inventory-mcp-server
npm install
```

No API keys, no environment variables, no accounts required.

## Run the server

```bash
npm start
```

The server speaks MCP over stdio. Connect it to any MCP-compatible client
(Claude Desktop, Cursor, Continue, etc.) using the stdio transport.

### Example MCP client configuration

```json
{
  "mcpServers": {
    "resale-inventory": {
      "command": "node",
      "args": ["/path/to/resale-inventory-mcp-server/src/server.js"]
    }
  }
}
```

## Available tools

| Tool | Description |
|------|-------------|
| `add_item` | Add a new inventory item (SKU, cost, sale price, storage location). |
| `get_item` | Get a single inventory item by SKU. |
| `list_items` | List all inventory items. |
| `update_item` | Update an existing inventory item by SKU. |
| `remove_item` | Remove an inventory item by SKU. |

## Data storage

All inventory is stored in `inventory.json` in the working directory (or
`$RESALE_INVENTORY_DATA_DIR` if set). The file is created automatically on first
use. You can back it up, edit it by hand, or delete it to start over.

## Test

```bash
npm test
```

Tests cover the tool input schemas (Zod) for valid and invalid inputs.

## License

MIT License. Copyright (c) 2026 Asdale Dynamics, LLC.

## Credit

Created by Asdale Dynamics, LLC (dylanasdale.github.io). Beginner-friendly AI
education, books, guides, and practical tools.
