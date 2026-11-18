# cpacontractingllc.com — VPS Deployment Guide (Nginx + PM2)

| चीज़ | वैल्यू |
| --- | --- |
| OS | Ubuntu 26.04 (KVM4 VPS) |
| Canonical URL | `https://www.cpacontractingllc.com` (non-www → www redirect) |
| App folder | `/var/www/cpacontractingllc.com` |
| Next.js पोर्ट | `127.0.0.1:3001` (सिर्फ localhost, बाहर से सीधा नहीं खुलेगा) |
| PM2 नाम | `cpa-contracting` |
| Nginx फाइल | `/etc/nginx/sites-available/cpacontractingllc.com` |

इस फोल्डर की फाइलें:

- `nginx/cpacontractingllc.com.http-only.conf`: पहला SSL certificate लेने के लिए temporary config
- `nginx/cpacontractingllc.com.conf`: फाइनल HTTPS config
- `ecosystem.config.cjs`: PM2 प्रोसेस (पोर्ट 3001)
- `deploy.sh`: git pull, install, build और PM2 reload करता है। Nginx और SSL को नहीं छूता।

> **Build सर्वर पर ही क्यों?** साइट `next/image` यूज़ करती है, जो `sharp` नाम की native library पर चलती है। Windows पर बनी build Linux पर नहीं चलेगी, इसलिए code git से जाता है और build VPS पर होती है।

---

## 0. DNS (डोमेन पैनल में)

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | VPS का IPv4 |
| A | `www` | VPS का IPv4 |
| AAAA (अगर IPv6 है) | `@` और `www` | VPS का IPv6 |

चेक करें (दोनों में VPS IP आना चाहिए):

```bash
dig +short cpacontractingllc.com
dig +short www.cpacontractingllc.com
```

---

## 1. सर्वर की तैयारी (पूरे VPS के लिए एक बार; बाकी 13 साइटों पर दोबारा नहीं करना)

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install nginx certbot git curl build-essential

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Node.js 24 LTS
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt -y install nodejs
node -v    # >= 20.9 होना चाहिए

# PM2
sudo npm install -g pm2

# Deploy user + folders
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/letsencrypt
sudo chown deploy:deploy /var/www
```

> अगर NodeSource पर Ubuntu 26.04 अभी सपोर्टेड न हो, तो `sudo apt install nodejs npm` करके `node -v` चेक करें। version 20.9 या उससे ऊपर होना चाहिए।

---

## 2. GitHub एक्सेस (Deploy Key)

Repo: `github.com/CPA-aviation/cpa-contracting`

```bash
sudo -iu deploy
ssh-keygen -t ed25519 -C "vps-cpacontracting" -f ~/.ssh/cpa_contracting -N ""
cat ~/.ssh/cpa_contracting.pub
```

इस public key को GitHub पर डालें: **Repo → Settings → Deploy keys → Add key** (read-only)। फिर `~/.ssh/config` में यह जोड़ें:

```
Host github-cpa-contracting
    HostName github.com
    User git
    IdentityFile ~/.ssh/cpa_contracting
    IdentitiesOnly yes
```

> हर साइट के लिए अलग deploy key और अलग `Host` alias रखें, क्योंकि GitHub एक key को सिर्फ एक repo पर लगाने देता है।

---

## 3. Code clone करें और पहली बार चलाएं (`deploy` user के रूप में)

```bash
git clone git@github-cpa-contracting:CPA-aviation/cpa-contracting.git /var/www/cpacontractingllc.com
bash /var/www/cpacontractingllc.com/deploy/deploy.sh
```

आखिर में `OK — site is responding` आना चाहिए।

Reboot के बाद PM2 अपने आप चालू हो, इसके लिए (यह एक बार ही करना है):

```bash
pm2 startup systemd -u deploy --hp /home/deploy
# यह एक sudo वाली कमांड प्रिंट करेगा। उसे sudo वाले user से चलाएं।
pm2 save
```

---

## 4. Nginx: पहले HTTP-only config (certificate लेने के लिए)

```bash
sudo cp /var/www/cpacontractingllc.com/deploy/nginx/cpacontractingllc.com.http-only.conf \
        /etc/nginx/sites-available/cpacontractingllc.com
sudo ln -s /etc/nginx/sites-available/cpacontractingllc.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default      # सिर्फ पहली साइट के समय
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. SSL certificate (Let's Encrypt)

`certonly --webroot` यूज़ करते हैं ताकि certbot आपकी Nginx फाइल को न छेड़े और config पूरी तरह आपके हाथ में रहे।

```bash
sudo certbot certonly --webroot -w /var/www/letsencrypt \
  -d cpacontractingllc.com -d www.cpacontractingllc.com \
  --deploy-hook "systemctl reload nginx"
```

Renewal अपने आप होगा (`certbot.timer`)। टेस्ट करने के लिए:

```bash
sudo certbot renew --dry-run
```

---

## 6. Nginx: फाइनल HTTPS config

```bash
sudo cp /var/www/cpacontractingllc.com/deploy/nginx/cpacontractingllc.com.conf \
        /etc/nginx/sites-available/cpacontractingllc.com
sudo nginx -t && sudo systemctl reload nginx
```

चेक करें:

```bash
curl -I http://cpacontractingllc.com          # 301 → https://www...
curl -I https://cpacontractingllc.com         # 301 → https://www...
curl -I https://www.cpacontractingllc.com     # 200
```

---

## 7. आगे के अपडेट

Code GitHub `main` पर push करने के बाद:

```bash
sudo -iu deploy bash /var/www/cpacontractingllc.com/deploy/deploy.sh
```

> Build के दौरान (लगभग 1 मिनट) साइट कुछ पल के लिए error दे सकती है, क्योंकि पुराना प्रोसेस `.next` फोल्डर से चल रहा होता है।

काम की कमांड्स:

```bash
pm2 status
pm2 logs cpa-contracting --lines 100
pm2 restart cpa-contracting
sudo tail -f /var/log/nginx/cpacontractingllc.com.error.log
```

---

## 8. Contact form (बाद में, जब backend सर्वर बनेगा)

अभी `ENQUIRY_ENDPOINT` सेट नहीं है, इसलिए form "unconfigured" वाला मैसेज दिखाएगा। यह उम्मीद के मुताबिक है। Backend तैयार होने पर `deploy/ecosystem.config.cjs` में `ENQUIRY_ENDPOINT` डालें और `deploy.sh` फिर से चलाएं। Contact page यह वैल्यू build के समय पढ़ता है, इसलिए rebuild ज़रूरी है।

---

## 9. पोर्ट रजिस्टर (14 साइटों के लिए)

| पोर्ट | डोमेन | PM2 नाम |
| --- | --- | --- |
| 3001 | www.cpacontractingllc.com | cpa-contracting |
| 3002 | — | — |
| 3003 | — | — |
