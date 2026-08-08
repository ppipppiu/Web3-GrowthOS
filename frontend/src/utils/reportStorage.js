// 用户报告本地存储


export function saveReport(wallet, report){

    if(!wallet){
        return;
    }


    const storage =
        JSON.parse(
            localStorage.getItem("growth_reports")
        )
        || {};



    if(!storage[wallet]){

        storage[wallet]=[];

    }



    storage[wallet].push({

        id:
        Date.now(),


        created_at:
        new Date().toLocaleString(),


        ...report

    });



    localStorage.setItem(
        "growth_reports",
        JSON.stringify(storage)
    );


}





export function getReports(wallet){


    if(!wallet){

        return [];

    }



    const storage =
        JSON.parse(
            localStorage.getItem("growth_reports")
        )
        || {};



    return storage[wallet] || [];

}