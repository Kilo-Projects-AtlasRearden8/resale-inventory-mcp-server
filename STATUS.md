# STATUS

## What was built

A local-first Model Context Protocol (MCP) server for reselling inventory
(eBay, Amazon, and beyond). It runs over stdio and stores inventory in a local
JSON file (`inventory.json`). No API keys, no accounts, nothing leaves your
machine.

Features:
- MCP server with stdio transport (`src/server.js`)
- Five tools: `add_item`, `get_item`, `list_items`, `update_item`, `remove_item`
- Each item tracks: SKU, cost, sale price, storage location
- Local JSON storage (`src/storage.js`), data directory configurable via
  `$RESALE_INVENTORY_DATA_DIR`
- Zod input validation (`src/schema.js`)
- Clean JSON Schema tool input schemas for MCP clients
- 22 unit tests covering all tool schemas (`test/schemas.test.js`)
- MIT LICENSE, README, `.gitignore`, `vitest.config.js`

Built and maintained by **Asdale Dynamics, LLC** (dylanasdale.github.io).

## How to run

```bash
npm install          # install dependencies
npm start            # run the MCP server over stdio
npm test             # run the test suite
```

Connect any MCP-compatible client (Claude Desktop, Cursor, Continue, etc.) via
stdio:

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

## Verification results

- `npm test`: 22 tests passed across 1 test file
- `npm start`: server starts, responds to `initialize` and `tools/list` over stdio
- End-to-end over stdio (shell pipe): `initialize`, `add_item`, `get_item`,
  `list_items`, `update_item` all responded correctly
- Storage layer verified directly: add, find, remove, duplicate-SKU rejection,
  missing-SKU rejection all behave correctly
- `inventory.json` is created automatically on first use and is gitignored

## Known gaps

- `remove_item` and `get_item` (after removal) were exercised at the storage
  layer and confirmed working; the full stdio round-trip for those two tools was
  not captured in the automated pipe test because closing stdin immediately can
  race with stdout flushing. Real MCP clients keep the stdio connection open for
  the session, so this does not affect normal use.
- No build step (plain ESM, runs directly with `node`).
- No linting configured beyond vitest.
- Data is stored in a single JSON file with no concurrent-write locking; intended
  for single-client local use.

## Files

- `src/server.js` — MCP server, stdio transport, tool handlers
- `src/storage.js` — local JSON storage (CRUD by SKU)
- `src/schema.js` — Zod validation schemas + MCP JSON Schema tool definitions
- `test/schemas.test.js` — 22 schema unit tests
- `package.json` — project metadata, `start` and `test` scripts
- `vitest.config.js` — vitest configuration
- `LICENSE` — MIT, Copyright (c) 2026 Asdale Dynamics, LLC
- `README.md` — usage, configuration, credit to Asdale Dynamics, LLC
- `.gitignore` — excludes node_modules, inventory.json, dist, coverage
- `package-lock.json` — locked dependencies
