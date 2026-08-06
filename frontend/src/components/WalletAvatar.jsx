function WalletAvatar() {
  return (
    <div className="wallet-avatar">
      <button className="avatar-circle" type="button" aria-label="钱包菜单">
        WG
      </button>
      <div className="wallet-menu glass-card">
        <div className="wallet-menu-item">钱包地址</div>
        <div className="wallet-menu-item">当前网络：Monad Testnet</div>
        <div className="wallet-menu-item">我的分析报告</div>
        <div className="wallet-menu-item">断开钱包</div>
      </div>
    </div>
  );
}

export default WalletAvatar;
