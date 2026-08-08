import pandas as pd

from processors.cleaning import clean_events

from processors.event_converter import dataframe_to_events



data = {

"wallet_address":[
"0xabc",
"0xabc",
None
],


"event_type":[
"swap",
"swap",
"mint"
],


"timestamp":[
"2026-07-01",
"2026-07-01",
"2026-07-02"
],


"value":[
100,
100,
50
],


"source":[
"demo",
"demo",
"demo"
]

}



df = pd.DataFrame(data)



clean_df, report = clean_events(df)



print(report)



events = dataframe_to_events(
    clean_df
)


for e in events:

    print(e)