import pandas as pd


from analytics.user_profile import (
    generate_user_profiles
)


from analytics.metrics import (
    calculate_growth_metrics
)



data = {


"wallet_address":[

"0xabc",

"0xabc",

"0xdef",

"0xaaa"

],


"event_type":[

"swap",

"stake",

"mint",

"swap"

],


"timestamp":[

"2026-07-01",

"2026-07-05",

"2026-07-02",

"2026-07-03"

],


"value":[

100,

200,

50,

20

]

}



df = pd.DataFrame(data)



df["timestamp"] = pd.to_datetime(
    df["timestamp"]
)



profiles = generate_user_profiles(
    df
)



metrics = calculate_growth_metrics(
    df,
    profiles
)



print(metrics)