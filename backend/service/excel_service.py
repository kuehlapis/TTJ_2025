import pandas as pd


class ExcelService:
    def __init__(self):
        self.df = self.open_csv()

    def open_csv(self):
        try:
            return pd.read_excel("backend/dataset/dataset.xlsx")
        except Exception as e:
            print(f"Error fetching dataset:{e}")

    def get_content(self):
        row_contents = self.df.iloc[0, :2].tolist()
        input_text = ".".join(filter(None, row_contents))
        return input_text.strip()
