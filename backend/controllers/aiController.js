const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const aiChat = async (req, res) => {
  const { messages } = req.body;

  try {
    const chatMessages = [
      {
        role: 'system',
        content: `You are MedCare AI, an advanced medical assistant for a Hospital Management System. 
        Your role is to:
        1. Analyze patient symptoms described by hospital staff
        2. Suggest possible diagnoses (always recommend consulting a doctor)
        3. Recommend the appropriate doctor specialization
        4. Provide general health advice
        5. Answer medical queries professionally
        
        Always add a disclaimer that this is for informational purposes only and patients should consult a qualified doctor.
        Keep responses concise, professional, and helpful.
        Use emojis to make responses friendly.`
      },
      ...messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }))
    ];

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { aiChat };