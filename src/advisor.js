import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function businessAdvice(state) {
  const prompt = `
Bạn là chuyên gia kinh doanh thực chiến.

Dữ liệu:
- Traffic: ${state.traffic}
- Conversion Rate: ${state.conversion_rate}
- Average Order Value: ${state.avg_order_value}
- Ads Spend: ${state.ads_spend}

Hãy trả lời NGẮN GỌN, THỰC TẾ:

1. 📊 Đánh giá tình hình (tốt/xấu vì sao)
2. ⚠️ Điểm yếu lớn nhất
3. 💡 3 cách cải thiện NGAY
4. 💰 Gợi ý tăng doanh thu nhanh

Không nói lý thuyết. Chỉ nói thứ có thể làm.
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  return res.choices[0].message.content;
}