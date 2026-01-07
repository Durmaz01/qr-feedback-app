// Yıldız Puanlama Mantığı
const stars = document.querySelectorAll('.stars i');
let starRatingValue = 0;

stars.forEach((star) => {
    star.addEventListener('click', () => {
        starRatingValue = parseInt(star.getAttribute('data-value'));
        stars.forEach((s, index) => {
            if (index < starRatingValue) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });
});

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    submitBtn.disabled = true;

    // Radyo butonlarından güvenli veri alma
    const getVal = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : 'Belirtilmedi';
    };

    const formData = {
        fullname: document.getElementById('fullname').value || 'Anonim',
        phone: document.getElementById('phone').value || "Belirtilmedi",
        food_quality: getVal('food_quality'),
        welcome_farewell: getVal('welcome_farewell'),
        service_quality: getVal('service_quality'),
        staff_interest: getVal('staff_interest'),
        order_accuracy: getVal('order_accuracy'),
        service_speed: getVal('service_speed'),
        information: getVal('information'),
        taste: getVal('taste'),
        cleanliness: getVal('cleanliness'),
        ambiance: getVal('ambiance'),
        music: getVal('music'),
        general_star_rating: starRatingValue, // Yıldız puanı
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                title: 'Teşekkürler!',
                text: 'Değerlendirmeniz alındı. 🎉',
                icon: 'success',
                confirmButtonColor: '#c0392b'
            });
            document.getElementById('feedbackForm').reset();
            stars.forEach(s => s.classList.remove('active'));
            starRatingValue = 0;
        } else {
            Swal.fire('Hata!', result.message, 'error');
        }

    } catch (error) {
        console.error('Hata:', error);
        Swal.fire('Bağlantı Hatası', 'Sunucuya ulaşılamadı.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

/* --- TELEFON NUMARASI KISITLAMASI --- */
document.getElementById('phone').addEventListener('input', function (e) {
    // 1. Sadece rakamları al, harfleri ve boşlukları sil
    var x = this.value.replace(/\D/g, '');
    
    // 2. Başında '0' yoksa ve veri giriliyorsa otomatik '0' ekle (Opsiyonel, istersen silebilirsin)
    // if (x.length > 0 && x[0] !== '0') {
    //     x = '0' + x;
    // }

    // 3. Maksimum 11 karaktere izin ver (05XX XXX XX XX)
    if (x.length > 11) {
        x = x.slice(0, 11);
    }

    // 4. Temizlenmiş veriyi geri yaz
    this.value = x;
});