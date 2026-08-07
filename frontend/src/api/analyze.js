const API_BASE_URL = "http://localhost:8000";


export async function analyzeCSV(file) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    const response = await fetch(
        `${API_BASE_URL}/api/analyze`,
        {
            method: "POST",
            body: formData
        }
    );


    if (!response.ok) {

        throw new Error(
            "Analysis failed"
        );

    }


    const result = await response.json();


    return result;

}