# NOVA Living — Mobilya E-ticaret Arayüzü

HTML, CSS ve Vanilla JavaScript ile hazırlanmış responsive mobilya mağazası arayüzü. Ürünleri listeleme, kategori filtreleme, arama, sıralama, favoriler, sepet ve Three.js tabanlı 3D ürün inceleme deneyimi içerir.

## Çalıştırma

Three.js ES modülleri ve import map kullanıldığı için projeyi bir yerel web sunucusu üzerinden açın.

### VS Code
1. ZIP'i çıkarın ve klasörü VS Code ile açın.
2. **Live Server** eklentisini kurun.
3. `index.html` dosyasına sağ tıklayıp **Open with Live Server** seçin.

### Alternatif
Proje klasöründe terminal açıp:
```bash
python -m http.server 5500
```
Ardından `http://localhost:5500` adresini açın.

## Dosya yapısı
```text
nova-furniture-store/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── products.js
    └── viewer3d.js
```

## Özellikler
- Tam ekran video hero slider (otomatik geçiş, ileri/geri kontrolü)
- Responsive tasarım ve mobil navigasyon
- Ürün kartları, kategori filtreleri ve fiyat sıralama
- Canlı ürün araması
- Favorilere ekleme
- Sepet çekmecesi, adet artırma/azaltma ve ara toplam
- Ürün hızlı inceleme penceresi
- Three.js ile etkileşimli 3D koltuk modeli; döndürme, zoom ve renk değiştirme
- E-posta bülteni formu için demo geri bildirimi

## Özelleştirme
- Ürünleri `js/products.js` içindeki `products` dizisinden değiştirin.
- Renkler ve responsive düzen `css/style.css` içindeki CSS değişkenleri ve media query'ler üzerinden düzenlenir.
- Hero video kaynakları `index.html` içindeki `.hero-video` video elementlerindedir.
- Ürün ve kategori görselleri örnek Unsplash görselleridir.

## Notlar
Bu proje ön yüz prototipidir. Gerçek sipariş, ödeme, kullanıcı hesabı, stok ve kargo işlemleri için backend/API ve ödeme sağlayıcısı entegrasyonu gerekir. Video ve görseller internet üzerinden yüklenir; video oynatımı bağlantı ve üçüncü taraf kaynakların erişilebilirliğine bağlıdır.
