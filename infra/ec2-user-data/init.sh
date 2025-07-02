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

# 5. Install Docker Compose plugin
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)
curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

systemctl enable docker
systemctl start docker

# 6. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf awscliv2.zip aws/
aws --version || true  # Check installation, ignore failure

# 7. Install nginx and basic setup
apt-get install -y nginx

# 8. Remove default nginx config and set up reverse proxy
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

# 9. Install Certbot and issue SSL certificate (APT version, more stable for cloud-init)
apt-get install -y certbot python3-certbot-nginx

# 10. Add ubuntu user to docker group
usermod -aG docker ubuntu
