const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.static("public"));

app.post("/api", async (req, res) => {
  try {
    const { text, mode } = req.body;

    let systemPrompt = "Sen İSTEK Okulu'nun resmi ve samimi yapay zeka asistanısın. Öğrencilere yardımcı, motive edici ve Türkçe cevap ver.";

    if (mode === "program") {
      systemPrompt = "Sen çalışma programı uzmanısın. Öğrenci sabah 8:00'de uyanıp 8:40'ta okulda oluyor. Buna göre gerçekçi, dengeli ve motive edici bir günlük/haftalık çalışma programı hazırla. Saatleri net belirt, dinlenme ve yemek saatleri de olsun.";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        max_tokens: 1100,
        temperature: 0.75
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";

    res.json({ reply });

  } catch (e) {
    console.error(e);
    res.json({ reply: "Bağlantı hatası oluştu. Lütfen tekrar dene." });
  }
});

app.listen(3000, () => {
  console.log("✅ İSTEK AI başarıyla çalışıyor → http://localhost:3000");
});
