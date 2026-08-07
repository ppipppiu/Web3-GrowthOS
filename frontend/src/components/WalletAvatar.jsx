import { useNavigate } from "react-router-dom";

import { getWallet, getBalance, disconnectWallet } from "../blockchain/wallet";

import { useEffect, useState } from "react";

function WalletAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");

  const [balance, setBalance] = useState("0 MON");

  const [menuTimer, setMenuTimer] = useState(null);

  // ============================
  // 加载钱包状态
  // ============================

  async function loadWallet() {
    const address = getWallet();

    if (address) {
      setWalletAddress(address);

      const bal = await getBalance();

      setBalance(bal);
    } else {
      setWalletAddress("");

      setBalance("0 MON");
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  // ============================
  // 监听钱包状态变化
  // ============================

  useEffect(() => {
    const updateWallet = () => {
      loadWallet();
    };

    window.addEventListener("walletChanged", updateWallet);

    return () => {
      window.removeEventListener("walletChanged", updateWallet);
    };
  }, []);

  // ============================
  // 监听 MetaMask账户变化
  // ============================

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length) {
        setWalletAddress(accounts[0]);

        const bal = await getBalance();

        setBalance(bal);
      } else {
        setWalletAddress("");

        setBalance("0 MON");

        navigate("/");
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  // ============================
  // 地址缩略
  // ============================

  function shortenAddress(address) {
    if (!address) {
      return "未连接";
    }

    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  // ============================
  // 菜单控制
  // ============================

  function openMenu() {
    if (menuTimer) {
      clearTimeout(menuTimer);
    }

    setShowMenu(true);
  }

  function closeMenu() {
    const timer = setTimeout(() => {
      setShowMenu(false);
    }, 800);

    setMenuTimer(timer);
  }

  // ============================
  // 断开钱包
  // ============================

  function handleDisconnect() {
    disconnectWallet();

    setWalletAddress("");

    setBalance("0 MON");

    setShowMenu(false);

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div
      className="wallet-avatar"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <div className="avatar-circle" onClick={() => navigate("/profile")}>
        WG
      </div>

      {showMenu && (
        <div
          className="wallet-menu glass-card"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <div className="wallet-menu-item">
            {shortenAddress(walletAddress)}
          </div>

          <div className="wallet-menu-item">{balance}</div>

          {walletAddress ? (
            <>
              <div
                className="wallet-menu-item"
                onClick={() => navigate("/profile")}
              >
                个人中心
              </div>

              <div
                className="wallet-menu-item"
                onClick={() => navigate("/reports")}
              >
                我的分析报告
              </div>

              <div className="wallet-menu-item" onClick={handleDisconnect}>
                断开钱包
              </div>
            </>
          ) : (
            <div className="wallet-menu-item" onClick={() => navigate("/")}>
              连接钱包
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WalletAvatar;
