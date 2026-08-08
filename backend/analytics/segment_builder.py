import pandas as pd



def get_threshold(
    distribution,
    metric,
    rule
):

    data = distribution.get(metric)


    if not data:
        return None


    mapping = {

        "top10":"p90",

        "top25":"p75",

        "top50":"p50"

    }


    percentile = mapping.get(rule)


    if not percentile:
        return None


    return data[percentile]





def build_segment(
    profiles,
    distribution,
    rules
):


    df = profiles.copy()



    conditions = []



    metric_mapping = {

        "transaction_value":
        "total_volume",


        "transaction_count":
        "transaction_count",


        "active_days":
        "active_days"

    }



    for metric, rule in rules.items():


        field = metric_mapping.get(metric)


        if not field:
            continue



        threshold = get_threshold(
            distribution,
            metric,
            rule
        )


        if threshold is None:
            continue



        conditions.append(

            df[field] >= threshold

        )



    if not conditions:


        result = df



    else:


        result = conditions[0]


        for condition in conditions[1:]:

            result = result & condition



        result = df[result]



    return result