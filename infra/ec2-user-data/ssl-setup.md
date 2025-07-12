# SSL 인증서 수동 발급 및 적용 가이드

## 1. 사전 준비

- 도메인 DNS A 레코드가 EC2의 Public IP를 정확히 가리키고 있어야 합니다.
- DNS 전파가 완료되었는지 `ping 도메인` 또는 `nslookup`으로 확인하세요.

## 2. 다음을 수행 (certbot 설치가 되었음을 가정) - 도메인에 대한 SSL 인증서 발급

sudo certbot --nginx -d 도메인 --non-interactive --agree-tos -m your@email.com --redirect || true

## 3. 인증서 갱신 자동화 등록

(crontab -l 2>/dev/null; echo '0 0 \* \* \* certbot renew --post-hook "systemctl reload nginx"') | crontab -
