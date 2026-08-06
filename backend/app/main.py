from fastapi import FastAPI, UploadFile, File
import pandas as pd
import io


from backend.services.pipeline import AnalysisPipeline



app = FastAPI(
    title="Monad Growth Intelligence API",
    version="0.2"
)



pipeline = AnalysisPipeline()



@app.get("/")
def root():

    return {
        "message":
        "Monad Growth Intelligence API v0.2"
    }



@app.post("/api/analyze")
async def analyze(
    file: UploadFile = File(...)
):

    contents = await file.read()


    df = pd.read_csv(
        io.BytesIO(contents)
    )


    result = pipeline.run(
        df
    )


    return result