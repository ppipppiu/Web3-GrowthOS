import { Link } from "react-router-dom";


function Workspace() {


  return (


    <div className="page page-workspace glass-panel">


      <div className="page-title">

        分析工作区

      </div>




      <div className="workspace-cards">





        <Link
          to="/dashboard"
          className="workspace-card glass-card"
        >

          <h3>
            用户增长数据看板
          </h3>

          <p>
            查看指标、趋势与用户行为漏斗。
          </p>

        </Link>






        <Link
          to="/growth/value"
          className="workspace-card glass-card"
        >

          <h3>
            AI增长分析中心
          </h3>

          <p>
            根据分析结果生成增长策略建议。
          </p>

        </Link>







        <Link
          to="/reports"
          className="workspace-card glass-card"
        >

          <h3>
            我的分析报告
          </h3>

          <p>
            查看历史分析结果与验证报告。
          </p>

        </Link>








        <Link
          to="/profile"
          className="workspace-card glass-card"
        >

          <h3>
            钱包信息
          </h3>

          <p>
            查看已连接钱包与当前网络信息。
          </p>


        </Link>




      </div>


    </div>


  );


}


export default Workspace;