# Tài nguyên cho giao diện Núi lửa xanh ngọc

Thiết kế đã được người dùng duyệt từ GPT-6 Astra. Hai ảnh được tạo bằng công cụ ImageGen tích hợp; chỉ nén định dạng WebP khi đưa vào dự án.

- `public/assets/volcano/classroom-jade-v1.webp`: nền phòng và một mặt bàn chữ nhật, không có vật thí nghiệm hoặc UI vẽ sẵn.
- `public/assets/volcano/clay-cocoa-v1.webp`: bản đồ màu/bề mặt đất nặn cho hình học có thể nặn và xoay.
- Núi, khay, cốc, vật liệu, dụng cụ và dòng chảy được dựng bằng Three.js; không dùng ảnh concept làm cảnh tương tác giả.

## Prompt nền

Use case: precise-object-edit. Create a clean background plate from the supplied approved UI design. Preserve the exact bright preschool classroom, realistic natural daylight, wooden shelves, books, plants, windows, blue rug in the middle distance, calm color balance and camera height. Preserve ONE continuous rectangular pale oak tabletop across the foreground. Remove EVERY foreground object: the volcano, clay, cup, BOTH jade trays/mats, all liquids, jug, bowl, teaspoon, dropper and wooden stick. Remove EVERY UI graphic: title, logo, labels, question, icons, buttons, switches and text. Reconstruct the tabletop seamlessly in their places with natural continuous oak grain. The rear edge of the desk is a straight line at 44% image height, and the wood fills the bottom 56% all the way to every edge. The result is ONLY the empty real classroom with the one empty rectangular desk, ready for interactive 3D props to be rendered over it. No new objects, no extra tables in the foreground, no circles, no pedestals, no UI, no text. Landscape 16:10. Background slightly soft, tabletop crisp. Keep the visual identity of this exact approved scene.

## Prompt chất liệu đất

Use case: product-mockup. Asset type: seamless diffuse material texture for an editable 3D handmade clay volcano in a preschool science experiment. Generate a square tile that is entirely filled by one continuous flat expanse of real cocoa-brown modeling clay, warm medium brown around #865138, with realistic small irregular overlapping thumb-smoothed patches, shallow subtle seams, a few soft fingertip impressions and extremely fine natural clay grain. This is an orthographic top-down close-up MATERIAL SWATCH, no objects, no cone, no mountain, no border, no text, no gradients, no dramatic directional lighting, no cast shadow. Cross-polarized diffuse even neutral lighting; natural color variation, no baked glossy highlights. Surface is softly kneaded moist modeling clay, tactile, matte and smooth inside patches; not volcanic stone, not cracked dry earth, not mud, not chocolate. Patches should be broad and few, avoiding excessive identical fingerprints or concentric ridges. Seamlessly tileable on all four edges, flat albedo with restrained dimensional micro-detail for use as a color and bump texture.

