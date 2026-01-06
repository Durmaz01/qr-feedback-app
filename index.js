const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mevcut bağlantı yapını aynen korudum
const dbURI = 'mongodb+srv://jhosephjoany064_db_user:sifre123@cluster0.lpk65po.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log("✅ Bulut Veritabanına Başarıyla Bağlanıldı!"))
    .catch(err => console.log("❌ Bağlantı Hatası:", err));

// --- GÜNCELLENEN KISIM: YENİ VERİTABANI ŞEMASI ---
// Formdaki tüm yeni alanları buraya ekledik
const FeedbackSchema = new mongoose.Schema({
    fullname: String,
    
    // Detaylı Kategoriler (Radio Butonlar)
    welcome_farewell: String,
    food_quality: String,     // Yemek Kalitesi
    service_quality: String,  // Servis Kalitesi
    staff_interest: String,   // İlgili/Güleryüz
    order_accuracy: String,   // Sipariş Doğruluğu
    service_speed: String,    // Servis Hızı
    information: String,      // Bilgilendirme
    taste: String,            // Lezzet
    cleanliness: String,      // Temizlik
    ambiance: String,         // Ortam
    music: String,            // Müzik

    // Genel Puan (En alttaki yıldızlar)
    general_star_rating: Number, 

    message: String,
    date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

app.post('/api/feedback', async (req, res) => {
    try {
        console.log("📥 Gelen Veri:", req.body); // Veriyi konsolda görmek için
        const yeniVeri = new Feedback(req.body);
        await yeniVeri.save();
        res.status(200).json({ message: "Geri bildirim veritabanına kaydedildi!" });
    } catch (err) {
        console.error("Hata:", err);
        res.status(500).json({ message: "Kaydedilirken hata oluştu." });
    }
});

app.get('/api/feedbacks', async (req, res) => {
    try {
        const veriler = await Feedback.find().sort({ date: -1 });
        res.json(veriler);
    } catch (err) {
        res.status(500).json({ message: "Veriler çekilemedi." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu çalışıyor...`);
});