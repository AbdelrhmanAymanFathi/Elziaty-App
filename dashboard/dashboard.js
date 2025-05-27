  const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const assocApi = 'http://localhost:3000/api/associations';
    const userApi = 'http://localhost:3000/api/admin/create-user';

    // Render helper
    function renderAssociationCard(assoc) {
      return `
        <div class="bg-white p-4 rounded-lg shadow space-y-2">
          <h3 class="font-bold text-lg">${assoc.name}</h3>
          <p>المبلغ الشهري: ${assoc.monthlyAmount}</p>
          <p>المدة: ${assoc.duration} ${assoc.type}</p>
          <p>الحالة: ${assoc.status}</p>
          <p>الحد الأعلى للأعضاء: ${assoc.maxMembers}</p>
          <div class="flex justify-end space-x-2 rtl:space-x-reverse">
            <button onclick="openEditAssociationModal(${assoc.id}, ${assoc.monthlyAmount}, ${assoc.duration}, '${assoc.status}')" class="text-blue-600">تعديل</button>
            <button onclick="openDeleteAssociationModal(${assoc.id})" class="text-red-600">حذف</button>
          </div>
        </div>
      `;
    }

    // Load associations
    async function loadAssociations() {
      document.getElementById('contentContainer').innerHTML = document.getElementById('associationsTemplate').innerHTML;
      try {
        const res = await axios.get(`${assocApi}?page=1&pageSize=5&status=pending`);
        const data = res.data;
        if (!Array.isArray(data.data)) throw new Error();
        const container = document.getElementById('associationsContainer');
        container.innerHTML = data.data.map(renderAssociationCard).join('');
      } catch (e) {
        document.getElementById('associationsContainer').innerHTML = `<div class="text-red-500 p-4">⚠️ لا توجد جمعيات.</div>`;
      }
    }

    // Create Association
    function openCreateAssociationModal() { document.getElementById('createAssociationModal').classList.remove('hidden');document.getElementById('createAssociationModal').classList.add('flex'); }
    function closeCreateAssociationModal() { document.getElementById('createAssociationModal').classList.add('hidden'); }
    document.getElementById('createAssociationForm').onsubmit = async e => {
      e.preventDefault();
      const form = e.target; const body = Object.fromEntries(new FormData(form));
      body.monthlyAmount = +body.monthlyAmount; body.duration = +body.duration;
      await axios.post(assocApi, body);
      closeCreateAssociationModal(); loadAssociations();
    };

    // Edit Association
    function openEditAssociationModal(id, amount, duration, status) {
      const form = document.getElementById('editAssociationForm');
      form.id.value=id; form.monthlyAmount.value=amount; form.duration.value=duration; form.status.value=status;
      document.getElementById('editAssociationModal').classList.remove('hidden');
       document.getElementById('editAssociationModal').classList.add('flex');
    }
    function closeEditAssociationModal() { document.getElementById('editAssociationModal').classList.add('hidden'); }
    document.getElementById('editAssociationForm').onsubmit = async e => {
      e.preventDefault(); const form=e.target; const id=form.id.value;
      const body={ monthlyAmount:+form.monthlyAmount.value, duration:+form.duration.value, status:form.status.value };
      await axios.put(`${assocApi}/${id}`, body);
      closeEditAssociationModal(); loadAssociations();
    };

    // Delete Association
    function openDeleteAssociationModal(id) { document.getElementById('deleteAssocId').value=id; document.getElementById('deleteAssociationModal').classList.remove('hidden'); document.getElementById('deleteAssociationModal').classList.add('flex'); }
    function closeDeleteAssociationModal() { document.getElementById('deleteAssociationModal').classList.add('hidden'); }
    async function confirmDeleteAssociation() {
      const id=document.getElementById('deleteAssocId').value;
      await axios.delete(`${assocApi}/${id}`);
      closeDeleteAssociationModal(); loadAssociations();
    }

    // Create User
    function openCreateUserModal() { document.getElementById('createUserModal').classList.remove('hidden');  document.getElementById('createUserModal').classList.add('flex'); }
    function closeCreateUserModal() { document.getElementById('createUserModal').classList.add('hidden'); }
    document.getElementById('createUserForm').onsubmit = async e => {
      e.preventDefault(); const form=e.target; const body=Object.fromEntries(new FormData(form));
      await axios.post(userApi, body);
      closeCreateUserModal(); alert('تم إنشاء المستخدم بنجاح');
    };

    // Initialize
    window.onload = loadAssociations;

    // إضافة الرابط الجديد
const usersApi = 'http://localhost:3000/api/userData/users'; // Users endpoint

// دالة ترندر صف مستخدم
function renderUserRow(user, index) {
  return `
    <tr class="border-t">
      <td class="px-4 py-2">${index + 1}</td>
      <td class="px-4 py-2">${user.fullName}</td>
      <td class="px-4 py-2">${user.nationalId}</td>
      <td class="px-4 py-2">${user.phone}</td>
      <td class="px-4 py-2">${user.walletBalance}</td>
      <td class="px-4 py-2">${user.role}</td>
      <td class="px-4 py-2">${new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
    </tr>
  `;
}

// دالة لجلب وعرض المستخدمين
async function loadUsers() {
  // نعرض التمبليت بدل المحتوى الحالي
  document.getElementById('contentContainer').innerHTML =
    document.getElementById('usersTemplate').innerHTML;

  try {
    const res = await axios.get(usersApi);
    const users = res.data;
    const container = document.getElementById('usersContainer');
    container.innerHTML = users
      .map((u, i) => renderUserRow(u, i))
      .join('');
  } catch (err) {
    console.error('خطأ في جلب المستخدمين:', err);
    document.getElementById('usersContainer').innerHTML =
      `<tr><td colspan="7" class="text-center p-4 text-red-500">فشل تحميل المستخدمين</td></tr>`;
  }
}
