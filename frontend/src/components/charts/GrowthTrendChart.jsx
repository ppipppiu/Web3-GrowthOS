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





function GrowthTrendChart({data=[], expanded=false}){


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




const options={

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

labels:{

color:"#cbd5e1"

}

}

},

scales:{

x:{

ticks:{

color:"rgba(203,213,225,0.72)",

maxTicksLimit: expanded ? 28 : 8,

maxRotation:45,

minRotation:0

},

grid:{

color:"rgba(255,255,255,0.035)"

}

},

y:{

ticks:{

color:"rgba(203,213,225,0.72)"

},

grid:{

color:"rgba(255,255,255,0.035)"

}

}

}

};


return (

<div className="chart-card glass-card">


<h3 className="chart-title">

增长趋势

</h3>


<div className="growth-trend-chart-wrapper">

<Line

data={chartData}

options={options}

/>

</div>


</div>

);


}


export default GrowthTrendChart;