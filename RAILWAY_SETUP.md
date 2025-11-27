# Railway 24/7 Deployment Rehberi

## 📋 Kontrol Listesi

### 1️⃣ Adım: PostgreSQL Ekle
- [ ] Railway dashboard'ını aç (railway.app)
- [ ] Projeye git
- [ ] Sağ üst köşede "Create" / "Add Plugin" tıkla
- [ ] **PostgreSQL** seç
- [ ] PostgreSQL otomatik oluşturulacak ✅

### 2️⃣ Adım: Environment Variables Ayarla
Railway'de **"Variables"** sekmesine git ve ekle:

```
JWT_SECRET = minecraft_bot_secret_key_2024
NODE_ENV = production
```

**NOT:** DATABASE_URL otomatik PostgreSQL'den gelecek ✅

### 3️⃣ Adım: Deploy Başlat
- [ ] **"Deploy"** ya da **"Build & Deploy"** butonuna tıkla
- [ ] Yeşil durum görünene kadar bekle (2-3 dakika)
- [ ] Deployment URL'sini kopyala

### 4️⃣ Adım: Test Et
Deployment bittikten sonra:
- [ ] Verilen URL'ye git
- [ ] Kayıt yap / Giriş yap
- [ ] Bot ekle
- [ ] Botu başlat
- [ ] 24/7 çalışmalı ✅

---

## 🔑 JWT_SECRET Oluştur

Daha güvenli bir JWT_SECRET için terminal'de:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıktıyı kopyala ve Railway'de JWT_SECRET olarak yapıştır.

---

## ⚠️ Önemli Notlar

- PostgreSQL plugin'i eklemek zorunlu (veri kaybı olmaz)
- JWT_SECRET değiştirmek tavsiye edilir (güvenlik için)
- Deployment sonrası botlar 24/7 çalışacak ✅

---

## 🆘 Sorun Yaşarsan

1. Railway logs'unu kontrol et (Deployment başında)
2. DATABASE_URL mevcut mi kontrol et
3. JWT_SECRET ayarlandı mı kontrol et
4. Node.js build başarılı mı kontrol et
