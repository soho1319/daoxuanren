#!/usr/bin/env node
import { cpSync, rmSync, existsSync } from 'fs';

const SRC = 'D:/Backup/Documents/我的Obsidian文档/道玄/daoxuanren';
const DEST = 'D:/daoxuanren/src/content/blog';

// 清空目标目录再复制，避免残留文件
if (existsSync(DEST)) {
  rmSync(DEST, { recursive: true, force: true });
}
cpSync(SRC, DEST, { recursive: true });
console.log(`✅ 已同步 ${SRC} → ${DEST}`);
