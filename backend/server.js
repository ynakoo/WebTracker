const express  = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())
app.post("/categorize", async (req, res) => {
    const { domains } = req.body;
    const prompt = `
    You are an AI that categorizes websites into one of these categories:
Productive, Learning, Social, Entertainment, Other.

 IMPORTANT:
- Return ONLY raw JSON
- Do NOT use markdown
- Do NOT wrap in \`\`\`
- Do NOT explain anything

Input domains:
${domains.join(", ")}

Output example:
{
  "github.com": "Productive",
  "youtube.com": "Entertainment"
}
`;
    //gemini-1.5-flash-latest
    const response = await fetch( `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
    });

    const data = await response.json();
    console.log(data)
    let new_data
    try {
      new_data = JSON.parse(data.candidates[0].content.parts[0].text);
    } 
    catch (err) {
      return res.status(500).json({
        err: "Invalid JSON from Gemini"
      });
    }
    console.log(new_data)
    return res.status(201).json(new_data);
  });


app.listen(3000,()=>{
    console.log('server started')
})