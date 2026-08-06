import pandas as pd


from analytics.user_profile import (
    generate_user_profiles
)


from analytics.segmentation import (
    segment_users
)



data = {


"wallet_address":[

"0xhigh",
"0xhigh",

"0xnew",

"0xactive",
"0xactive",
"0xactive"

],


"event_type":[

"swap",
"swap",

"mint",

"swap",
"swap",
"stake"

],


"timestamp":[

"2026-07-01",
"2026-07-05",

"2026-07-02",

"2026-07-01",
"2026-07-03",
"2026-07-06"

],


"value":[

1000,
500,

50,

100,
100,
100

]

}



df = pd.DataFrame(data)


df["timestamp"] = pd.to_datetime(
    df["timestamp"]
)



profiles = generate_user_profiles(
    df
)



segments = segment_users(
    profiles
)



for s in segments:

    print(s)