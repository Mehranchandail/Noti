module.exports = async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Browser me check karne ke liye (GET request)
  if (req.method === 'GET') {
     return res.status(200).json({ status: "✅ API is running perfect! App se POST request bhejo." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerId, title, message, url } = req.body;

  if (!playerId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const APP_ID = "ac0d7a63-cacc-476b-bb9b-35ad9eab5ed7"; 
  // Yaha neeche apni real REST API Key daalein
  const REST_API_KEY = "os_v2_app_vqgxuy6kzrdwxo43gwwz5k26246jyhzgjbye37fsmm7ocovegzaw6ja7oopvdbpvy4d66aof3zqypux2frd3tycs774vqyq7xwposfy"; 

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: APP_ID,
      include_player_ids: [playerId],
      headings: { en: title },
      contents: { en: message },
      url: url || ''
    })
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', options);
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Push Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
