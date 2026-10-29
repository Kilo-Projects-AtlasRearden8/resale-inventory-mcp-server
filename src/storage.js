import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = process.env.RESALE_INVENTORY_DATA_DIR || process.cwd();
const DATA_FILE = join(DATA_DIR, 'inventory.json');

function ensureDataFile() {
  if (!existsSync(DATA_FILE)) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readItems() {
  ensureDataFile();
  const raw = readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeItems(items) {
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export function listItems() {
  return readItems();
}

export function findItemBySku(sku) {
  return readItems().find((item) => item.sku === sku);
}

export function addItem(item) {
  const items = readItems();
  if (items.some((existing) => existing.sku === item.sku)) {
    throw new Error(`Item with SKU ${item.sku} already exists`);
  }
  items.push(item);
  writeItems(items);
  return item;
}

export function updateItem(sku, changes) {
  const items = readItems();
  const index = items.findIndex((item) => item.sku === sku);
  if (index === -1) {
    throw new Error(`Item with SKU ${sku} not found`);
  }
  items[index] = { ...items[index], ...changes };
  writeItems(items);
  return items[index];
}

export function removeItem(sku) {
  const items = readItems();
  const filtered = items.filter((item) => item.sku !== sku);
  if (filtered.length === items.length) {
    throw new Error(`Item with SKU ${sku} not found`);
  }
  writeItems(filtered);
  return true;
}

export { DATA_FILE };
