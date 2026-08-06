import {
Doughnut
} from "react-chartjs-2";


import {

Chart as ChartJS,

ArcElement,

Tooltip

} from "chart.js";


ChartJS.register(

ArcElement,

Tooltip

);





function RiskChart({data=[]}){


const chartData={


labels:

data.map(
item=>item.name
),



datasets:[

{

data:

data.map(
item=>item.count
),


backgroundColor:[

"#ef4444",

"#f59e0b",

"#22c55e"

]


}

]


};



return (

<div className="chart-card">


<h3 className="chart-title">

钱包风险分布

</h3>


<Doughnut

data={chartData}

/>


</div>

);


}



export default RiskChart;