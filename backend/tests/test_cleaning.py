import pandas as pd

from backend.app.services.cleaning_service import (
    clean_transactions
)


df = pd.read_csv(
    "Data/invalid_sample.csv"
)


result = clean_transactions(df)


print(
    result["cleaning_report"]
)


print(
    result["clean_dataframe"].head()
)