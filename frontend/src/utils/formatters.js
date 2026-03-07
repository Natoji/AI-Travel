export function formatCurrencyVND(value) {
  const amount = Number(value)
  if (Number.isNaN(amount)) return ''
  return `${amount.toLocaleString('vi-VN')}đ`
}

export function formatRelativeDate(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Hôm qua'
  return `${diff} ngày trước`
}
