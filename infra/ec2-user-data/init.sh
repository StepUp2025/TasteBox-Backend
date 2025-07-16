#!/bin/bash
set -e

# 1. Update and upgrade system packages
apt-get update -y
apt-get upgrade -y

# 2. Install essential packages
apt-get install -y git curl unzip

# 3. Install Node.js (version 22.x)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# 4. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

systemctl enable docker
systemctl start docker

# 5. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws/
aws --version || true  # Check installation, ignore failure

# 6. Install nginx and basic setup
apt-get install -y nginx

# 7. Remove default nginx config and set up reverse proxy
rm -f /etc/nginx/sites-enabled/default

cat <<EOF > /etc/nginx/sites-available/tastebox
server {
    listen 80;
    server_name api.taste-box.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/tastebox /etc/nginx/sites-enabled/tastebox

nginx -t && systemctl restart nginx

# 8. Install Certbot and issue SSL certificate (APT version, more stable for cloud-init)
apt-get install -y certbot python3-certbot-nginx

# 9. Add ubuntu user to docker group
usermod -aG docker ubuntu
systemctl restart docker

# 10. Start SSM Agent
if ! snap services amazon-ssm-agent | grep -q "enabled"; then
    snap enable amazon-ssm-agent
fi
snap start amazon-ssm-agent

# 위 사용자 데이터 작업이 다 진행된 이후에 적용이 잘 되지 않은 것이 있다면 수동으로 reboot해도 좋습니다.
# 로그로 사용자 데이터 작업내용이 모두 수행됐는지 확인하는 것이 선행되어야 합니다.