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





function RetentionChart({data=[]}){


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

"#22c55e",

"#3b82f6",

"#f59e0b",

"#ef4444"

]


}

]


};



return (

<div className="chart-card">


<h3 className="chart-title">

用户留存状态

</h3>


<Doughnut

data={chartData}

/>


</div>

);


}



export default RetentionChart;