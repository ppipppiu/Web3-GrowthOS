import {
    Line
} from "react-chartjs-2";


import {

Chart as ChartJS,

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

} from "chart.js";



ChartJS.register(

CategoryScale,

LinearScale,

PointElement,

LineElement,

Tooltip,

Legend

);





function GrowthTrendChart({data=[]}){


const chartData={


labels:

data.map(
item=>item.date
),



datasets:[


{


label:"交易次数",

data:

data.map(
item=>item.transactions
),


borderColor:"#8b5cf6",

tension:.4


},



{


label:"交易价值",

data:

data.map(
item=>item.volume
),


borderColor:"#22c55e",

tension:.4


}


]


};




return (

<div className="chart-card glass-card">


<h3 className="chart-title">

增长趋势

</h3>


<Line

data={chartData}

/>


</div>

);


}


export default GrowthTrendChart;