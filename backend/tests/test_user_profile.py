import pandas as pd

from analytics.user_profile import generate_user_profiles



data = {

"wallet_address":[
"0xabc",
"0xabc",
"0xdef"
],


"event_type":[
"swap",
"stake",
"mint"
],


"timestamp":[
"2026-07-01",
"2026-07-05",
"2026-07-02"
],


"value":[
100,
200,
50
]

}


df = pd.DataFrame(data)


df["timestamp"] = pd.to_datetime(
    df["timestamp"]
)


profiles = generate_user_profiles(df)



for p in profiles:

    print(p)