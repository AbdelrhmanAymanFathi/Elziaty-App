// wallet.js

document.addEventListener('DOMContentLoaded', () => {
  // افتح/اغلق قائمة البروفايل
  document.getElementById('profile-toggle').addEventListener('click', () => {
    document.getElementById('popup-menu').classList.toggle('hidden');
  });
  // زر تسجيل خروج
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // جلب التوكن والـ balance element
  const token = localStorage.getItem('token');
  const balanceEl = document.getElementById('wallet-balance');
  if (!token) {
    balanceEl.textContent = 'يرجى تسجيل الدخول';
    return;
  }

  // جلب الرصيد الحالي من السيرفر
  fetch('http://localhost:3000/api/users/wallet', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(data => {
      balanceEl.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP',
        currencyDisplay: 'code'
      }).format(data.walletBalance);
    })
    .catch(err => {
      console.error('Fetch wallet error:', err);
      balanceEl.textContent = 'خطأ في التحميل';
    });

  // عناصر المودال
  const modal     = document.getElementById('topup-modal');
  const btnOpen   = document.getElementById('topup-btn');
  const btnCancel = document.getElementById('topup-cancel');
  const btnOk     = document.getElementById('topup-ok');
  const inputAmt  = document.getElementById('topup-amount');

  // فتح/إغلاق المودال
  btnOpen.addEventListener('click',  () => modal.classList.remove('hidden'));
  btnCancel.addEventListener('click',() => modal.classList.add('hidden'));

  // شحن المحفظة عند الضغط على موافق
  btnOk.addEventListener('click', () => {
    const amount = parseFloat(inputAmt.value);
    if (isNaN(amount) || amount <= 0) {
      alert('يرجى إدخال مبلغ صحيح أكبر من صفر');
      return;
    }

    // POST لعملية التوب أب
    fetch('http://localhost:3000/api/payments/topup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          alert(data.error || 'فشل في الشحن');
          return Promise.reject();
        }
        // لو نجح الشحن، نعيد جلب الرصيد الفعلي
        return fetch('http://localhost:3000/api/users/wallet', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      })
      .then(res => res.json())
      .then(walletData => {
        balanceEl.textContent = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EGP',
          currencyDisplay: 'code'
        }).format(walletData.walletBalance);
        modal.classList.add('hidden');
        inputAmt.value = '';
        alert('تمت عملية الشحن بنجاح');
      })
      .catch(err => {
        console.error('Top-up error:', err);
      });
  });
});
