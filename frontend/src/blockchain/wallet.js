import { ethers } from "ethers";

// ===============================
// 保存钱包状态
// ===============================

function saveWallet(address) {
  localStorage.setItem("walletAddress", address);

  // 保存连接时间
  if (!localStorage.getItem("walletConnectTime")) {
    localStorage.setItem(
      "walletConnectTime",
      new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  }

  // 通知组件更新
  window.dispatchEvent(new Event("walletChanged"));
}

// ===============================
// 连接钱包
// ===============================

export async function connectWallet() {
  if (!window.ethereum) {
    alert("请安装 MetaMask");

    return null;
  }

  try {
    // 强制 MetaMask 重新选择账户
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];

    saveWallet(address);

    return address;
  } catch (error) {
    console.log("Wallet connect error:", error);

    return null;
  }
}

// ===============================
// 获取钱包地址
// ===============================

export function getWallet() {
  return localStorage.getItem("walletAddress");
}

// ===============================
// 获取余额
// ===============================

export async function getBalance() {
  if (!window.ethereum) {
    return "0 MON";
  }

  const address = getWallet();

  if (!address) {
    return "0 MON";
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const balance = await provider.getBalance(address);

    return Number(ethers.formatEther(balance)).toFixed(2) + " MON";
  } catch (error) {
    console.log("Balance error:", error);

    return "0 MON";
  }
}

// ===============================
// 获取当前网络
// ===============================

export async function getNetwork() {
  if (!window.ethereum) {
    return "";
  }

  try {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    const networks = {
      // Monad Testnet
      "0x279f": "Monad Testnet",

      // Ethereum
      "0x1": "Ethereum Mainnet",

      // Sepolia
      "0xaa36a7": "Sepolia Testnet",
    };

    return networks[chainId] || `Unknown Network (${chainId})`;
  } catch (error) {
    console.log("Network error:", error);

    return "";
  }
}

// ===============================
// 获取连接时间
// ===============================

export function getConnectTime() {
  return localStorage.getItem("walletConnectTime") || "";
}

// ===============================
// 断开钱包
// ===============================

export function disconnectWallet() {
  // 清除本地钱包状态

  localStorage.removeItem("walletAddress");

  localStorage.removeItem("walletConnectTime");

  // 通知所有 React 组件刷新

  window.dispatchEvent(new Event("walletChanged"));
}
