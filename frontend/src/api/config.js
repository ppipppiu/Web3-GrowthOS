// =====================================================
// Web3 GrowthOS - API Configuration
//
// 本地开发：
//   如果没有设置 VITE_API_BASE_URL，
//   默认访问本机 FastAPI：http://127.0.0.1:8000
//
// Vercel 公网：
//   在 Vercel Environment Variables 中设置：
//
//   VITE_API_BASE_URL=https://xxxxx.trycloudflare.com
//
//   前端所有 API 请求都会自动切换到 Cloudflare Tunnel。
// =====================================================

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

// 防止环境变量最后带 "/"，导致出现：
// https://xxx.com//api/analyze
export const API_BASE_URL =
  rawBaseUrl.replace(/\/+$/, "");

// 方便统一生成 API 地址
export function apiUrl(path = "") {
  if (!path) {
    return API_BASE_URL;
  }

  const normalizedPath =
    path.startsWith("/")
      ? path
      : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}