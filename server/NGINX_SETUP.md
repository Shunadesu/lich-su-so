# Hướng dẫn cấu hình Nginx cho SSL Let's Encrypt

## Vấn đề
Let's Encrypt cần truy cập file challenge tại `/.well-known/acme-challenge/` để verify domain, nhưng Nginx chưa được cấu hình để serve các file này.

## Giải pháp

### Bước 1: Tạo thư mục cho ACME challenge
```bash
sudo mkdir -p /var/www/html/.well-known/acme-challenge
sudo chmod -R 755 /var/www/html/.well-known
```

### Bước 2: Cấu hình Nginx

1. **Tạo file cấu hình:**
```bash
sudo nano /etc/nginx/sites-available/lichsuso.online
```

2. **Copy nội dung từ `server/nginx.conf` vào file này**

3. **Tạo symlink:**
```bash
sudo ln -s /etc/nginx/sites-available/lichsuso.online /etc/nginx/sites-enabled/
```

4. **Kiểm tra cấu hình:**
```bash
sudo nginx -t
```

5. **Reload Nginx:**
```bash
sudo systemctl reload nginx
```

### Bước 3: Đảm bảo quyền truy cập
```bash
# Đảm bảo Nginx có quyền đọc thư mục
sudo chown -R www-data:www-data /var/www/html/.well-known
sudo chmod -R 755 /var/www/html/.well-known
```

### Bước 4: Thử lại SSL verification
Sau khi cấu hình xong, thử lại việc apply SSL trong control panel.

## Lưu ý quan trọng

1. **Location `/.well-known/acme-challenge/` PHẢI đặt TRƯỚC location `/`** trong cấu hình Nginx
2. Thư mục `/var/www/html/.well-known/acme-challenge/` phải có quyền đọc cho Nginx
3. Sau khi SSL được cài đặt thành công, uncomment phần HTTPS configuration trong file nginx.conf

## Kiểm tra

Test xem file challenge có thể truy cập được không:
```bash
# Tạo file test
echo "test" | sudo tee /var/www/html/.well-known/acme-challenge/test.txt

# Kiểm tra từ browser hoặc curl
curl http://lichsuso.online/.well-known/acme-challenge/test.txt
# Nếu thấy "test" thì cấu hình đúng
```

## Sau khi SSL được cài đặt

1. Uncomment phần HTTPS server block trong nginx.conf
2. Cập nhật đường dẫn SSL certificate (thường là `/etc/letsencrypt/live/lichsuso.online/`)
3. Reload Nginx: `sudo systemctl reload nginx`
4. Uncomment phần redirect HTTP → HTTPS trong HTTP server block

