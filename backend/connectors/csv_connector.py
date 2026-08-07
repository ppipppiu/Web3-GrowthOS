import pandas as pd


class CSVConnector:

    def load(self, file_path: str) -> pd.DataFrame:
        """
        Load raw CSV data.
        """

        return pd.read_csv(file_path)