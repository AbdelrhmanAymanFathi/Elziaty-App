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
const createuserApi = "http://localhost:3000/api/userData/admin/create-user";

  function openCreateUserModal() {
    document.getElementById('createUserModal').classList.remove('hidden');
    document.getElementById('createUserModal').classList.add('flex');
  }

  function closeCreateUserModal() {
    document.getElementById('createUserModal').classList.remove('flex');
    document.getElementById('createUserModal').classList.add('hidden');
  }

  document.getElementById('createUserForm').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const body = Object.fromEntries(new FormData(form));

    try {
      const res = await axios.post(createuserApi, body);
      if (res.data.message === "User created successfully") {
        alert("تم إنشاء المستخدم بنجاح");
        closeCreateUserModal();
        form.reset();
        // Optional: إعادة تحميل البيانات من السيرفر لعرضها في الجدول
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إنشاء المستخدم");
    }
  };

    // Initialize
    window.onload = loadAssociations;

    // إضافة الرابط الجديد
const usersApi = 'http://localhost:3000/api/userData/users'; // Users endpoint

// دالة ترندر صف مستخدم
function renderUserRow(user, index) {
  // تأكد إن رقم التليفون بصيغة دولية بدون +، مثلاً: "2010XXXXXXX"
  const waNumber = user.phone.startsWith('0')
    ? '+20' + user.phone.slice(1)        // لو عندك أرقام محلية تبدأ بـ0 شيلها وحط 2 (كود مصر)
    : user.phone;                     // لو بالفعل دولي

  return `
    <tr class="border-t">
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${index + 1}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${user.fullName}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${user.nationalId}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${user.phone}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap text-center text-green-600">
        <a class="text-center" href="https://wa.me/${waNumber}" target="_blank" title="أرسل رسالة واتساب">
          <!-- أيقونة واتساب بسيطة -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.67 13.412c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.149-.198.297-.767.967-.94 1.165-.173.198-.346.223-.643.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.149-.672-1.612-.92-2.21-.242-.579-.487-.5-.672-.51l-.572-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.075c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 .5C5.648.5.5 5.648.5 12c0 2.115.552 4.09 1.513 5.81L.5 23.5l5.924-1.55A11.457 11.457 0 0012 23.5c6.352 0 11.5-5.148 11.5-11.5S18.352.5 12 .5zm0 21c-1.795 0-3.483-.467-4.96-1.353l-.354-.21-3.515.92.938-3.43-.229-.365A9.436 9.436 0 012.5 12c0-5.242 4.258-9.5 9.5-9.5s9.5 4.258 9.5 9.5-4.258 9.5-9.5 9.5z"/>
          </svg>
        </a>
      </td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${user.walletBalance}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${user.role}</td>
      <td class="px-4 py-2 text-sm  whitespace-nowrap">${new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
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


function renderAssociationCard(assoc) {
  return `
    <div class="bg-white p-4 rounded-lg shadow space-y-2 flex flex-col">
      <h3 class="font-bold text-lg">${assoc.name}</h3>
      <!-- بيانات الجمعية -->
      <p>المبلغ الشهري: ${assoc.monthlyAmount}</p>
      <p>المدة: ${assoc.duration} ${assoc.type}</p>
      <p>الحالة: ${assoc.status}</p>
      <p>الحد الأقصى للأعضاء: ${assoc.maxMembers}</p>
      <!-- أزرار -->
      <div class="mt-auto flex justify-between space-x-2 rtl:space-x-reverse">
        <button onclick="openEditAssociationModal(${assoc.id}, ${assoc.monthlyAmount}, ${assoc.duration}, '${assoc.status}')"
                class="text-blue-600 hover:underline">تعديل</button>
        <button onclick="openDeleteAssociationModal(${assoc.id})"
                class="text-red-600 hover:underline">حذف</button>
        <button onclick="loadMembers(${assoc.id})"
                class="text-green-600 hover:underline">عرض الأعضاء</button>  <!-- زر جديد -->
      </div>
    </div>
  `;
}

// دالة لترندر صف عضو
function renderMemberRow(member, idx) {
  return `
    <tr class="border-t">
      <td class="px-4 py-2">${idx + 1}</td>
      <td class="px-4 py-2">${member.name}</td>
      <td class="px-4 py-2">${member.phone}</td>
      <td class="px-4 py-2">${member.hasReceived ? 'نعم' : 'لا'}</td>
      <td class="px-4 py-2">${member.lastReceivedDate
        ? new Date(member.lastReceivedDate).toLocaleDateString('ar-EG')
        : '-'}</td>
    </tr>
  `;
}

// دالة لجلب وعرض الأعضاء
async function loadMembers(assocId) {
  // استيراد التمبليت
  const tpl = document.getElementById('membersTemplate').content.cloneNode(true);
  // ربط الكونتينر
  const container = tpl.getElementById('membersContainer');
  // تفريغ المحتوى القديم
  const content = document.getElementById('contentContainer');
  content.innerHTML = '';
  content.appendChild(tpl);

  try {
    const res = await axios.get(`${assocApi}/${assocId}/members`);
    const members = res.data.data;
    if (!Array.isArray(members) || members.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="px-4 py-2 text-center text-red-500">
            لا يوجد أعضاء حالياً
          </td>
        </tr>`;
      return;
    }
    // بنحط كل صف
    container.innerHTML = members
      .map((m, i) => renderMemberRow(m, i))
      .join('');
  } catch (err) {
    console.error('خطأ في جلب الأعضاء:', err);
    container.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-2 text-center text-red-500">
          فشل في تحميل الأعضاء
        </td>
      </tr>`;
  }
}

