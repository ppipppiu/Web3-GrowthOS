function Profile() {
  return (
    <div className="page page-profile glass-panel">
      <div className="page-title">钱包信息</div>
      <div className="profile-panel glass-card">
        <div className="profile-row">
          <span>钱包地址</span>
          <strong>0x123...abcd</strong>
        </div>
        <div className="profile-row">
          <span>当前网络</span>
          <strong>Monad Testnet</strong>
        </div>
        <div className="profile-row">
          <span>连接时间</span>
          <strong>2026-08-06</strong>
        </div>
      </div>
    </div>
  );
}

export default Profile;
