#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Web3-GrowthOS v11 公网前端适配补丁

目标：
1. 不改 UI / JSX 结构 / 原业务功能。
2. 只把 frontend/src 中写死的 localhost:8000 / 127.0.0.1:8000
   改为统一使用 frontend/src/api/config.js 中的 apiUrl()。
3. 额外修复 Upload.jsx 与分析中心的存储 key 不一致：
   保留 sessionStorage["analysisResult"]，并同步 localStorage["analysis_result"]。
4. 自动备份修改前文件。
5. 最后全量扫描 frontend/src，避免遗漏。

运行：
    cd D:\Web3-GrowthOS
    python apply_v11_vercel_patch.py
"""

from __future__ import annotations

import os
import re
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path.cwd()
SRC_DIR = ROOT / "frontend" / "src"
CONFIG_FILE = SRC_DIR / "api" / "config.js"

HOST_PATTERN = re.compile(
    r"http://(?:localhost|127\.0\.0\.1):8000",
    re.IGNORECASE,
)

TEXT_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx"}


def fail(message: str) -> None:
    print(f"\n[失败] {message}")
    sys.exit(1)


def relative_config_import(file_path: Path) -> str:
    target = SRC_DIR / "api" / "config"
    rel = os.path.relpath(target, start=file_path.parent)
    rel = rel.replace("\\", "/")
    if not rel.startswith("."):
        rel = "./" + rel
    return rel


def ensure_api_import(text: str, import_path: str) -> str:
    if re.search(
        r'import\s*\{[^}]*\bapiUrl\b[^}]*\}\s*from\s*["\'][^"\']*config["\']\s*;',
        text,
    ):
        return text

    return f'import {{ apiUrl }} from "{import_path}";\n' + text


def replace_hardcoded_urls(text: str) -> tuple[str, int]:
    """
    示例：
      "http://localhost:8000/api/dashboard"
        -> apiUrl("/api/dashboard")

      `http://127.0.0.1:8000/api/reports/${wallet}`
        -> apiUrl(`/api/reports/${wallet}`)
    """
    count = 0

    template_pattern = re.compile(
        r"`http://(?:localhost|127\.0\.0\.1):8000([^`]*)`",
        re.IGNORECASE | re.DOTALL,
    )

    def repl_template(match: re.Match) -> str:
        nonlocal count
        count += 1
        return f"apiUrl(`{match.group(1)}`)"

    text = template_pattern.sub(repl_template, text)

    double_pattern = re.compile(
        r'"http://(?:localhost|127\.0\.0\.1):8000([^"]*)"',
        re.IGNORECASE,
    )

    def repl_double(match: re.Match) -> str:
        nonlocal count
        count += 1
        path = match.group(1).replace("\\", "\\\\").replace('"', '\\"')
        return f'apiUrl("{path}")'

    text = double_pattern.sub(repl_double, text)

    single_pattern = re.compile(
        r"'http://(?:localhost|127\.0\.0\.1):8000([^']*)'",
        re.IGNORECASE,
    )

    def repl_single(match: re.Match) -> str:
        nonlocal count
        count += 1
        path = match.group(1).replace("\\", "\\\\").replace("'", "\\'")
        return f"apiUrl('{path}')"

    text = single_pattern.sub(repl_single, text)

    return text, count


def sync_analysis_result_in_upload(text: str) -> tuple[str, bool]:
    if re.search(
        r'localStorage\.setItem\s*\(\s*["\']analysis_result["\']',
        text,
    ):
        return text, False

    pattern = re.compile(
        r"(setAnalysisResult\s*\(\s*result\s*\)\s*;)",
        re.MULTILINE,
    )

    match = pattern.search(text)
    if not match:
        raise RuntimeError(
            "Upload.jsx 中未找到 setAnalysisResult(result);，为避免误改已停止。"
        )

    addition = """

        // 公网适配：
        // 分析中心现有页面读取 localStorage["analysis_result"]。
        // 保留原 sessionStorage 逻辑，同时镜像一份分析结果。
        localStorage.setItem(
            "analysis_result",
            JSON.stringify(result)
        );"""

    text = text[: match.end()] + addition + text[match.end() :]
    return text, True


def scan_source_files() -> list[Path]:
    result = []
    for path in SRC_DIR.rglob("*"):
        if (
            path.is_file()
            and path.suffix.lower() in TEXT_EXTENSIONS
            and path.resolve() != CONFIG_FILE.resolve()
        ):
            result.append(path)
    return result


def main() -> None:
    print("=" * 72)
    print("Web3-GrowthOS v11 Vercel / Cloudflare API 地址补丁")
    print("=" * 72)
    print(f"项目目录: {ROOT}")

    if not (ROOT / "frontend").exists():
        fail(
            "当前目录下没有 frontend 文件夹。"
            "请先 cd 到 D:\\Web3-GrowthOS（项目根目录）再运行。"
        )

    if not CONFIG_FILE.exists():
        fail(
            "未找到 frontend/src/api/config.js。"
            "请确认你已经完成 config.js 的新增。"
        )

    config_text = CONFIG_FILE.read_text(encoding="utf-8")
    if "apiUrl" not in config_text or "VITE_API_BASE_URL" not in config_text:
        fail(
            "config.js 内容看起来不完整：必须包含 apiUrl 和 VITE_API_BASE_URL。"
        )

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = ROOT / f"_v11_vercel_patch_backup_{timestamp}"

    changed = []
    url_replacements = 0
    upload_synced = False
    staged = {}

    for path in scan_source_files():
        original = path.read_text(encoding="utf-8")
        updated, replaced = replace_hardcoded_urls(original)

        if replaced:
            updated = ensure_api_import(
                updated,
                relative_config_import(path)
            )
            url_replacements += replaced

        if path.resolve() == (SRC_DIR / "pages" / "Upload.jsx").resolve():
            updated, synced = sync_analysis_result_in_upload(updated)
            upload_synced = upload_synced or synced

        if updated != original:
            staged[path] = (original, updated)

    if staged:
        for path, (original, _) in staged.items():
            relative = path.relative_to(ROOT)
            backup_path = backup_dir / relative
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            backup_path.write_text(original, encoding="utf-8")

        for path, (_, updated) in staged.items():
            path.write_text(updated, encoding="utf-8")
            changed.append(path.relative_to(ROOT).as_posix())

    leftovers = []
    for path in scan_source_files():
        text = path.read_text(encoding="utf-8")
        for match in HOST_PATTERN.finditer(text):
            line = text.count("\n", 0, match.start()) + 1
            leftovers.append(
                f"{path.relative_to(ROOT).as_posix()}:{line} -> {match.group(0)}"
            )

    print("\n修改结果")
    print("-" * 72)

    if changed:
        for item in changed:
            print(f"[已修改] {item}")
    else:
        print("[无修改] 可能已经运行过此补丁。")

    print(f"\nAPI 地址替换数量: {url_replacements}")

    if upload_synced:
        print('Upload 数据同步: 已新增 localStorage["analysis_result"]')
    else:
        print("Upload 数据同步: 已存在或无需重复添加")

    if staged:
        print(f"\n备份目录: {backup_dir}")

    print("\n全量 localhost 检查")
    print("-" * 72)

    if leftovers:
        print("[警告] 仍发现以下硬编码地址，请不要部署：")
        for item in leftovers:
            print("  " + item)
        sys.exit(2)

    print("[通过] frontend/src 中没有遗漏 localhost:8000 / 127.0.0.1:8000")
    print("       （frontend/src/api/config.js 的本地 fallback 被有意保留）")

    print("\n重要说明")
    print("-" * 72)
    print("1. backend/app/main.py：未修改。")
    print("2. backend/services/report_storage.py：未修改。")
    print("3. 原 UI / JSX / 样式文件均未重构。")
    print("4. 旧 localhost 域名里的历史 localStorage 不会自动迁移到 Vercel。")
    print("5. 新版部署后请重新上传并完成一次分析，用于验证分析中心和新交易 Hash。")

    print("\n下一步")
    print("-" * 72)
    print("cd frontend")
    print("npm run build")
    print("")
    print("build 成功后，再创建 Cloudflare Tunnel，并在 Vercel 设置：")
    print("VITE_API_BASE_URL=https://你的-tunnel-地址")
    print("")
    print("然后重新部署 Vercel。")


if __name__ == "__main__":
    main()
