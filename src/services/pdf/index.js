
export async function pdfQuery(query) {
   

  try {
    const dataApi = await fetch(process.env.CHATPDF_API, {
        method: 'POST',
        headers: {
            'x-api-key': process.env.CHATPDF_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "sourceId": process.env.CHATPDF_SRC,
            "messages": [
                {
                    "role": "user",
                    "content": query
                }
            ]
        })
    })
    const response = await dataApi.json()
    return response.content
} catch (e) {
    console.log(e)
    return 'ERROR'
}
  
}
