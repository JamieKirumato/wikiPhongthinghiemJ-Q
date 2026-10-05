/** Local Vietnamese recordings: no device voice installation or runtime TTS request. */
export function narrationClipFor(message: string): string {
  const text = message.toLocaleLowerCase('vi');
  const rules: Array<[RegExp, string]> = [
    [/thân thuyền rỗng/, 'ship'],
    [/phao có phần/, 'lifevest'],
    [/khi hòa tan đủ muối/, 'saltlife'],
    [/lúc đầu trứng ở đáy/, 'reflection'],
    [/chọn vật, đưa vào/, 'help'],
    [/thuyền.*(chìm|tràn)|nước.*tràn/, 'boatsink'],
    [/kiện hàng|thêm.*hàng/, 'boatload'],
    [/thuyền.*nổi/, 'boatfloat'],
    [/thuyền/, 'boat'],
    [/ngoài.*bể|ném.*lệch/, 'miss'],
    [/đã tan|tan hoàn toàn|tan hết/, 'dissolved'],
    [/đang đổ|đang rơi/, 'pour'],
    [/khuấy|hòa tan muối/, 'stir'],
    [/thìa đã|thìa.*đầy|di thìa|nghiêng/, 'scoop'],
    [/hũ.*mở|xúc/, 'saltopen'],
    [/xoay bể|360/, 'orbit'],
    [/cầm và ném|chế độ.*ném/, 'interact'],
    [/bên cạnh|nhìn ngang/, 'side'],
    [/đã.*thay nước|nước mới|thử lại từ đầu/, 'reset'],
    [/đang cầm|buông tay|dìm/, 'hold'],
    [/dự đoán|con đoán/, 'predict'],
    [/so sánh|hai lần|trước.*sau/, 'compare'],
    [/kết luận|chọn.*tranh/, 'conclusion'],
    [/thực tế|đời sống|quanh mình/, 'reallife'],
    [/thử thách|làm.*trứng.*nổi/, 'egg'],
    [/đã tìm|hoàn thành|hoan hô/, 'correct'],
    [/đã chìm|đang chìm|chìm xuống đáy/, 'sink'],
    [/đang nổi|đã nổi|nổi trên/, 'float'],
    [/chào|chọn.*đồ vật/, 'welcome'],
    [/gợi ý|cách khác/, 'hint'],
  ];
  return `/audio/vi/${rules.find(([pattern]) => pattern.test(text))?.[1] || 'observe'}.mp3`;
}
