Web3-GrowthOS v11 Vercel 公网适配补丁
========================================

推荐使用这个“自动补丁”而不是整份覆盖 Dashboard.jsx / Agent.jsx 等大文件，
因为你的 v11 已经有很多 UI 和功能迭代。补丁直接修改你本机当前最新版文件，
可以最大程度避免 UI、Agent 流式输出、报告删除等功能被旧文件覆盖。

本补丁会：
1. 自动备份原文件。
2. 扫描 frontend/src。
3. 把所有写死的：
   http://localhost:8000
   http://127.0.0.1:8000
   改成 frontend/src/api/config.js 的 apiUrl()。
4. 修复 Upload.jsx：
   在保留 sessionStorage["analysisResult"] 的同时，
   额外写入 localStorage["analysis_result"]。
5. 再次全量扫描，确保没有遗漏。

本补丁不会修改：
- backend/app/main.py
- backend/services/report_storage.py

原因：
这两个后端文件不是“Vercel 前端访问 localhost”的来源。
FastAPI 本来就应该继续在本机 8000 端口运行，再由 Cloudflare Tunnel 暴露公网。
为了符合“只改端口、不丢功能”，当前阶段不应该整体覆盖后端文件。

运行方法
========
把以下三个文件放到 D:\Web3-GrowthOS：
- apply_v11_vercel_patch.py
- restore_v11_vercel_patch.py
- README.txt

然后 PowerShell：

cd D:\Web3-GrowthOS
python apply_v11_vercel_patch.py

成功后再执行：

cd frontend
npm run build

如果最后显示：
[通过] frontend/src 中没有遗漏 localhost:8000 / 127.0.0.1:8000

说明前端公网适配完成。

如果需要回滚：
cd D:\Web3-GrowthOS
python restore_v11_vercel_patch.py

注意
====
旧 localhost 域名和 Vercel 域名属于不同浏览器 Origin。
旧 localhost localStorage 中已经存在的 txHash 不会自动搬到 Vercel。

新版本上线后，请在 Vercel 页面重新上传并完成一次分析。
新生成的报告会继续走你原有的 saveReport(txHash) 逻辑。

如果后续要求“换电脑也能看到 txHash”，
再做第二阶段：把 txHash 回写 backend/reportdata。
那会涉及 backend/app/main.py + backend/services/report_storage.py，
不属于这次纯公网 API 地址适配。
