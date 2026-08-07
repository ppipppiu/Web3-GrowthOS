import {

Bar

} from "react-chartjs-2";


import {

Chart as ChartJS,

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

} from "chart.js";



ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

Tooltip,

Legend

);





function UserDistributionChart({data=[]}){


const chartData={


labels:

data.map(
item=>item.name
),



datasets:[

{


label:"用户数量",

data:

data.map(
item=>item.count
),


backgroundColor:"#8b5cf6",

borderRadius:10


}


]


};




return (

<div className="chart-card glass-card">


<h3 className="chart-title">

用户结构分布

</h3>


<Bar

data={chartData}

/>


</div>

);


}


export default UserDistributionChart;