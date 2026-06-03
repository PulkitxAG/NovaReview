export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Grab the secret key from Vercel's environment environment dashboard
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Groq API Key is not configured on the server.' });
        }

        const { systemPrompt, userPrompt } = req.body;

        // 2. Forward the prompt payloads to Groq from this hidden environment
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 4096,
                temperature: 0.7
            })
        });

        if (!groqResponse.ok) {
            const errData = await groqResponse.json().catch(() => ({}));
            return res.status(groqResponse.status).json(errData);
        }

        const data = await groqResponse.json();

        // 3. Send the response data back to script.js
        return res.status(200).json(data);

    } catch (error) {
        console.error("Serverless function error:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
