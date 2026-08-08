/**
 * 数据分析接口
 *
 * 功能：
 * 1. 上传链上交易数据
 * 2. 携带钱包地址
 * 3. 获取分析结果
 * 4. 保存用户历史报告
 */

import { apiUrl } from "./config";

/**
 * 调用后端分析接口
 *
 * @param {File} file
 * @param {String} walletAddress
 */
export async function analyzeData(
    file,
    walletAddress
) {

    if (!file) {
        throw new Error(
            "未选择文件"
        );
    }

    if (!walletAddress) {
        throw new Error(
            "钱包未连接"
        );
    }

    const formData =
        new FormData();

    // 上传文件
    formData.append(
        "file",
        file
    );

    // 钱包身份
    formData.append(
        "wallet_address",
        walletAddress
    );

    const response =
        await fetch(
            apiUrl("/api/analyze"),
            {
                method:
                    "POST",

                body:
                    formData
            }
        );

    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(
            error ||
            "分析失败"
        );
    }

    const result =
        await response.json();

    return result;
}