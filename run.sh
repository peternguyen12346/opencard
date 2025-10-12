#!/usr/bin/env bash
# Ngừng script nếu có lỗi
set -o errexit  

# Chạy migrate (tạo/cập nhật bảng trong database)
python manage.py migrate

# Gom toàn bộ file static (CSS, JS, images...) vào thư mục STATIC_ROOT
python manage.py collectstatic --noinput

# Khởi động Django server bằng gunicorn (Render yêu cầu chạy theo cổng môi trường PORT)
gunicorn opencard.wsgi:application --bind 0.0.0.0:$PORT
