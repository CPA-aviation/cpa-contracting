# cpacontractingllc.com — VPS Deployment Guide (Static site + Nginx)

| चीज़ | वैल्यू |
| --- | --- |
| Canonical URL | `https://www.cpacontractingllc.com` (non-www वाला URL www पर redirect होता है) |
| App folder | `/app/cpa-contracting` |
| Nginx क्या serve करता है | `/app/cpa-contracting/out` (static HTML/JS/CSS) |
| Node server / PM2 | **नहीं चाहिए।** साइट पूरी तरह static export है |
| Enquiry form | Browser से सीधे `https://clp.cpaleasing.com/api/v1/leads` पर जाता है |
| Nginx फाइल | `/etc/nginx/sites-available/cpacontractingllc.com` |

इस फोल्डर की फाइलें:

- `nginx/cpacontractingllc.com.http-only.conf`: पहला SSL certificate लेने के लिए temporary config
- `nginx/cpacontractingllc.com.conf`: फाइनल HTTPS config। Static files serve करता है और सारे security headers (CSP, HSTS…) भी देता है
- `deploy.sh`: git pull करता है, `npm ci` चलाता है, और `next build` से `out/` बनाता है। Nginx और SSL को नहीं छूता

सारे commands `root` से चलाने हैं।

---

## Enquiry form (Leads API)

Form का डेटा इस payload के साथ जाता है:

```json
{ "type": "quote", "name": "...", "email": "...", "phone": "...", "message": "...", "website": "" }
```

- Organisation और Interest के लिए API में अलग field नहीं है, इसलिए ये दोनों `message` की शुरुआत में जुड़ जाते हैं।
- `website` एक honeypot field है। Bots के लिए यह छिपा रहता है, असली visitor के लिए खाली रहता है।
- API `201` लौटाए तो success माना जाता है। `400` आए तो गलत fields highlight होते हैं। किसी और error पर form "not accepted" का मैसेज और email से भेजने का link दिखाता है।
- Site key सिर्फ इसी domain के लिए काम करती है (`www.cpacontractingllc.com` और `cpacontractingllc.com`)। किसी और origin से API `403` देता है, इसलिए browser bundle में key रहना ठीक है।

Key और URL **git में नहीं** रखे जाते। VPS पर `/app/cpa-contracting/.env.production` फाइल में डालें:

```bash
cat > /app/cpa-contracting/.env.production <<'EOF'
NEXT_PUBLIC_LEADS_API_URL=https://clp.cpaleasing.com/api/v1/leads
NEXT_PUBLIC_LEADS_SITE_KEY=<यहाँ site key>
EOF
```

Next.js यह फाइल build के समय पढ़ता है। इसलिए key बदलें तो `deploy.sh` दोबारा चलाना होगा।

---

## A. पुराने PM2 setup से migrate करना (एक बार)

**1. PM2 वाला Next.js server बंद करें**
```bash
pm2 delete cpa-contracting && pm2 save
```

**2. `.env.production` बनाएं** (ऊपर वाला command)

**3. Code और build अपडेट करें**
```bash
bash /app/cpa-contracting/deploy/deploy.sh
```
आखिर में `OK — static site built` आना चाहिए।

**4. नया Nginx config लगाएं**
```bash
cp /app/cpa-contracting/deploy/nginx/cpacontractingllc.com.conf /etc/nginx/sites-available/cpacontractingllc.com && nginx -t && systemctl reload nginx
```

**5. Test करें**
```bash
curl -sI https://www.cpacontractingllc.com/contact | grep -iE "^HTTP|content-security"
```
`HTTP/2 200` आना चाहिए, और CSP में `https://clp.cpaleasing.com` दिखना चाहिए।

> अगर Nginx `403 Forbidden` दे, तो `www-data` user `/app` फोल्डर नहीं पढ़ पा रहा। इसे ठीक करने के लिए:
> ```bash
> chmod o+rx /app /app/cpa-contracting
> ```

---

## B. नए सर्वर पर पहली बार setup

सर्वर पर पहले से Nginx, certbot, Node 20.9+ और git होने चाहिए।

```bash
git clone https://github.com/CPA-aviation/cpa-contracting.git /app/cpa-contracting
```

फिर ये करें:
1. ऊपर बताए तरीके से `.env.production` बनाएं।
2. `deploy.sh` चलाएं।
3. HTTP-only config लगाएं:
```bash
mkdir -p /var/www/letsencrypt && cp /app/cpa-contracting/deploy/nginx/cpacontractingllc.com.http-only.conf /etc/nginx/sites-available/cpacontractingllc.com && ln -sf /etc/nginx/sites-available/cpacontractingllc.com /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx
```
4. SSL certificate लें:
```bash
certbot certonly --webroot -w /var/www/letsencrypt -d cpacontractingllc.com -d www.cpacontractingllc.com --deploy-hook "systemctl reload nginx"
```
5. फाइनल config लगाएं। इसके लिए ऊपर वाले section A का step 4 चलाएं।

---

## आगे के अपडेट

```bash
bash /app/cpa-contracting/deploy/deploy.sh
```

Nginx को reload करने की ज़रूरत नहीं है, क्योंकि नई files `out/` में आते ही serve होने लगती हैं। Build के दौरान (लगभग 30 सेकंड) `out/` फोल्डर दोबारा बनता है, इसलिए उतनी देर कुछ requests पर 404 आ सकता है।

Error log देखने के लिए:
```bash
tail -f /var/log/nginx/cpacontractingllc.com.error.log
```

---

## पोर्ट रजिस्टर

| पोर्ट | डोमेन | PM2 नाम |
| --- | --- | --- |
| — (static) | www.cpacontractingllc.com | — |
| 3003 | www.cpaleasing.com | cpa-aviation |
