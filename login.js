// login.js
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nationalId = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nationalId, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ تم تسجيل الدخول بنجاح");
      console.log("TOKEN:", data.token); // احفظ التوكن في session storge مثلاً
      localStorage.setItem("token", data.token);
      // redirect لو حابب
      window.location.href = "./home.html";
    } else {
      alert("❌ فشل تسجيل الدخول: " + data.message);
    }
  } catch (error) {
    alert("حدث خطأ أثناء الاتصال بالسيرفر");
    console.error(error);
  }
});

