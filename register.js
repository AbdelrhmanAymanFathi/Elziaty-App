document.getElementById('register-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // منع إعادة التحميل
  const form = document.getElementById('register-form');
  const formData = new FormData(form); // نستخدم FormData للحقول والملفات

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: formData
      // لا نحدد Content-Type لأن المتصفح يضبطه أوتوماتيك مع boundary
    });

    const data = await response.json();

    if (response.ok) {
      alert(' Registration successful!');
      console.log('User created:', data);
      // بعد التسجيل ممكن تحويل للصفحة التالية:
      window.location.href = 'login.html';
    } else {
      alert('❌ Registration failed: ' + (data.message || JSON.stringify(data)));
      console.error('Error:', data);
    }
  } catch (err) {
    alert(' Server connection error');
    console.error(err);
  }
});