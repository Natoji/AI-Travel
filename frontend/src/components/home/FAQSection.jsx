// src/components/home/FAQSection.jsx
import { useState } from 'react'

const faqs = [
  {
    q: 'AI Travel Planner hoạt động như thế nào?',
    a: 'Bạn nhập thông tin chuyến đi như điểm đến, ngày đi, ngân sách và phong cách du lịch. Hệ thống sẽ gửi thông tin đến Gemini AI để tạo lịch trình chi tiết theo từng giờ trong vòng 30 giây.'
  },
  {
    q: 'Sử dụng có mất phí không?',
    a: 'Hoàn toàn miễn phí! Bạn chỉ cần đăng ký tài khoản là có thể tạo lịch trình không giới hạn.'
  },
  {
    q: 'Lịch trình có phù hợp với ngân sách thấp không?',
    a: 'Hoàn toàn phù hợp! AI sẽ tự động điều chỉnh gợi ý địa điểm, ăn uống và chỗ ở theo đúng mức ngân sách bạn đặt ra, từ tiết kiệm đến thoải mái.'
  },
  {
    q: 'Tôi có thể lưu nhiều lịch trình cùng lúc không?',
    a: 'Có! Tất cả lịch trình bạn tạo đều được lưu tự động vào tài khoản, bạn có thể xem lại bất kỳ lúc nào trên Dashboard.'
  },
  {
    q: 'AI có gợi ý chính xác cho từng vùng miền Việt Nam không?',
    a: 'Có! Gemini AI được huấn luyện với dữ liệu phong phú về du lịch Việt Nam, bao gồm địa điểm, ẩm thực, văn hóa và thời điểm lý tưởng để ghé thăm từng nơi.'
  },
  {
    q: 'Lịch trình có tính phương tiện di chuyển không?',
    a: 'Có! Khi bạn nhập thành phố xuất phát, AI sẽ tự động gợi ý phương tiện phù hợp như máy bay, xe khách, tàu hỏa và tính chi phí vào ngân sách tổng.'
  },
  {
    q: 'Có thể tạo lịch trình cho nhóm đông người không?',
    a: 'Có! Form tạo lịch trình cho phép nhập số người tham gia, AI sẽ tự động tính toán tổng chi phí và đưa ra gợi ý phù hợp với quy mô nhóm.'
  },
  {
    q: 'Nếu AI tạo lịch trình không phù hợp thì sao?',
    a: 'Bạn có thể tạo lại lịch trình mới với thông tin điều chỉnh khác. Mỗi lần tạo AI sẽ cho ra kết quả khác nhau nên bạn hoàn toàn có thể thử nhiều lần.'
  },
  {
    q: 'Dữ liệu của tôi có được bảo mật không?',
    a: 'Có! Hệ thống sử dụng JWT Authentication và mã hóa mật khẩu bằng bcrypt. Thông tin cá nhân và lịch trình của bạn chỉ bạn mới có thể truy cập.'
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section style={{ padding: '100px 32px', background: 'white' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Giải đáp thắc mắc</span>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 48, fontWeight: 300, marginTop: 16, color: '#0f172a' }}>
            Câu hỏi thường gặp
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i}
              style={{ border: '1.5px solid', borderColor: openIndex === i ? '#c7d2fe' : '#e2e8f0', borderRadius: 16, overflow: 'hidden', transition: 'all 0.2s', background: openIndex === i ? '#fafbff' : 'white' }}>

              {/* Question */}
              <button onClick={() => toggle(i)}
                style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: openIndex === i ? '#4f46e5' : '#0f172a', lineHeight: 1.4 }}>
                  {faq.q}
                </span>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: openIndex === i ? '#6366f1' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 16, color: openIndex === i ? 'white' : '#64748b', lineHeight: 1, transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>+</span>
                </div>
              </button>

              {/* Answer */}
              {openIndex === i && (
                <div style={{ padding: '0 24px 20px 24px' }}>
                  <div style={{ height: 1, background: '#e0e7ff', marginBottom: 16 }} />
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}