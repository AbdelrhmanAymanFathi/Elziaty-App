    // تأكد من وجود التوكن وإعادة التوجيه للـ login إذا لم يكن موجودًا
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
    }

    // Dropdown للملف الشخصي
    document.getElementById('profile-toggle').addEventListener('click', () => {
      document.getElementById('popup-menu').classList.toggle('active');
    });

    // زر تسجيل الخروج
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });

    // دالة لتحميل الجمعيات التي انضممت إليها فقط
    async function loadMyAssociations() {
      try {
        const res = await fetch('http://localhost:3000/api/associations/my-associations', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || json.error || 'خطأ في جلب جمعياتي');

        const listEl = document.getElementById('circle-list');
        listEl.innerHTML = '';

        if (!json.data || json.data.length === 0) {
          listEl.innerHTML = '<p class="text-center text-muted">لم تنضم إلى أي جمعيات بعد / You have not joined any associations yet.</p>';
          return;
        }

        json.data.forEach(a => {
          const joinDate = new Date(a.joinDate).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          const card = document.createElement('div');
          card.className = 'circle-card';
          card.innerHTML = `
            <h5>${a.name} / ${a.name_en || ''}</h5>
            <p>انضممت في: ${joinDate} / Joined on: ${joinDate}</p>
            <p>المبلغ الشهري: ${a.monthlyAmount} | المدة: ${a.duration} شهر</p>
            <p>الحالة: ${a.status} / Status: ${a.status}</p>
          `;
          listEl.appendChild(card);
        });

      } catch (err) {
        console.error(err);
        alert('❌ ' + err.message);
      }
    }

    document.addEventListener('DOMContentLoaded', loadMyAssociations);