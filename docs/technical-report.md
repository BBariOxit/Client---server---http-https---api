# Báo cáo kỹ thuật

## 1. Giới thiệu

Dự án này xây dựng hệ thống Client-Server sử dụng giao thức HTTP/HTTPS, kết hợp các công nghệ TCP, WebSocket và API động. Mục tiêu là giúp sinh viên hiểu rõ kiến trúc client-server, cách phục vụ nội dung tĩnh/dynamic, phân tích network và đo hiệu năng hệ thống.

## 2. Mục tiêu

- Hiểu kiến trúc client-server, HTTP protocol, static/dynamic content.
- Thực hành xây dựng server, client, phân tích network.
- Đo hiệu năng, thử nghiệm các loại request.
- Mở rộng với TCP, WebSocket.

## 3. Kiến trúc hệ thống

- **Server:** Sử dụng Node.js + Express phục vụ nội dung tĩnh (HTML, CSS, JS) và API động (`/api/info`). Có thể chạy HTTP hoặc HTTPS (nhiệm vụ thưởng).
- **Client:** Tự xây dựng client HTTP, kiểm thử các loại request (GET, POST, lỗi, external API).
- **Monitor:** Script giám sát network, đo thời gian phản hồi, kích thước dữ liệu.
- **TCP/WS:** Demo server/client TCP và WebSocket.

Sơ đồ tổng quát:

```
[Client] <--HTTP/HTTPS--> [Server] <--TCP/WS--> [Other Clients]
```

## 4. Mô tả các thành phần

### 4.1. Server (`server.js`)

- Phục vụ file tĩnh từ thư mục `public/`.
- API động `/api/info` trả về thông tin hệ thống, headers client.
- Xử lý lỗi 404, 500, custom headers (X-Request-Id, X-Server-Name).
- Hỗ trợ HTTPS nếu có chứng chỉ.
- Tích hợp WebSocket server (port 3001).

### 4.2. Client (`client.js`)

- Tự xây dựng HTTP client, hỗ trợ GET/POST, custom headers.
- Kiểm thử với server nội bộ, external API (GitHub), POST tới JSONPlaceholder.
- Xử lý lỗi server không khả dụng.

### 4.3. Monitor (`monitor.js`)

- Gửi request tới các endpoint (static, dynamic, 404).
- Đo thời gian phản hồi, kích thước dữ liệu, phân loại static/dynamic.

### 4.4. TCP Server/Client (`tcp-server.js`, `tcp-client.js`)

- Server lắng nghe port 4000, trả lời dữ liệu nhận được.
- Client kết nối, gửi và nhận dữ liệu từ server.

### 4.5. WebSocket Demo (`ws-demo.js`)

- Server WebSocket (port 3002), gửi/nhận tin nhắn.
- Client demo gửi nhận tin nhắn với server.

### 4.6. Benchmark (`benchmark.js`)

- Đo hiệu năng phục vụ file tĩnh với các kích thước khác nhau.
- Ghi nhận thời gian phản hồi, kích thước file.

### 4.7. Giao diện web (`public/`)

- Trang web hiển thị thông tin server, thử lỗi, monitor network, demo WebSocket.
- Sử dụng Tailwind CSS, script JS cho các chức năng động.

## 5. Quy trình hoạt động

1. Khởi động server: `node server.js` (hoặc HTTPS nếu cấu hình).
2. Truy cập web tại `http://localhost:3000` để kiểm thử giao diện, API, monitor.
3. Chạy client: `node client.js` để kiểm thử các loại request.
4. Chạy monitor: `node monitor.js` để đo hiệu năng các endpoint.
5. Chạy TCP/WebSocket demo nếu cần.

## 6. Kết quả thử nghiệm & phân tích hiệu năng

- **Static assets:** Thời gian phản hồi nhanh, có cache, etag, last-modified.
- **API động:** Không cache, trả về thông tin hệ thống, headers client.
- **Lỗi 404/500:** Được xử lý rõ ràng, trả về thông báo phù hợp.
- **TCP/WebSocket:** Gửi nhận dữ liệu realtime, phù hợp cho ứng dụng chat, streaming.
- **Benchmark:** File nhỏ trả về gần như tức thì, file lớn có thể chậm hơn tùy cấu hình máy.
- **Monitor:** Ghi nhận thời gian, kích thước, loại request giúp phân tích hiệu năng tổng thể.

## 7. Kết luận

Hệ thống đã đáp ứng đầy đủ các yêu cầu về kiến trúc client-server, phục vụ nội dung tĩnh/dynamic, xử lý API, giám sát network, thử nghiệm hiệu năng. Việc mở rộng với TCP/WebSocket giúp sinh viên hiểu rõ hơn về các giao thức truyền thông khác ngoài HTTP.

## 8. Hướng phát triển

- Bổ sung xác thực, phân quyền cho API.
- Mở rộng chức năng WebSocket (chat, thông báo realtime).
- Tích hợp lưu trữ dữ liệu (database).
- Đo hiệu năng nâng cao, stress test.
- Viết thêm unit test cho các thành phần.

---
