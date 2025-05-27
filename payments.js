  /* JavaScript */
  // تأكد من وجود التوكن وإعادة التوجيه للـ login إذا لم يكن موجودًا
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// Dropdown للملف الشخصي
document.getElementById("profile-toggle").addEventListener("click", () => {
  document.getElementById("popup-menu").classList.toggle("active");
});

// زر تسجيل الخروج
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});