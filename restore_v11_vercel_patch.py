#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path
import shutil
import sys

ROOT = Path.cwd()

backups = sorted(
    [p for p in ROOT.glob("_v11_vercel_patch_backup_*") if p.is_dir()],
    key=lambda p: p.name,
    reverse=True,
)

if not backups:
    print("没有找到 _v11_vercel_patch_backup_* 备份目录。")
    sys.exit(1)

backup = backups[0]
print(f"将从最近备份恢复：{backup}")

for src in backup.rglob("*"):
    if not src.is_file():
        continue

    rel = src.relative_to(backup)
    dst = ROOT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"[恢复] {rel.as_posix()}")

print("恢复完成。")
