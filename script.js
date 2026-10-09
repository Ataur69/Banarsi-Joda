/* ==========================================================================
   BANARSI JODA - APPLICATION LOGIC (script.js)
   Firebase Auth, 4-Digit Underline OTP, Multi-step Validation,
   Urdu Initial Calligraphy, Height Converter, Profiles & B2B Trade Engine
   ========================================================================== */

// Firebase Initialization
const firebaseConfig = {
  apiKey: "AIzaSyD8h2eVchH4syRCGEjvQXMUbeMHUPWcJgo",
  authDomain: "banarsi-joda.firebaseapp.com",
  projectId: "banarsi-joda",
  storageBucket: "banarsi-joda.appspot.com",
  messagingSenderId: "1083424683072",
  appId: "1:1083424683072:web:e4ce75a40b904df607d730"
};

let auth = null, db = null, isFirebaseReady = false;
let currentUser = null;
let activeGenderFilter = 'All';
let countdownInterval = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    isFirebaseReady = true;

    auth.onAuthStateChanged((user) => {
      if (user) loginUser(user.displayName || user.phoneNumber || user.email || 'Member');
    });
  }
} catch (e) {
  console.warn("Firebase note:", e);
}

// Urdu initial calligraphy mapping
function getUrduInitial(name) {
  if (!name) return 'ب';
  const firstChar = name.trim().charAt(0).toUpperCase();
  const map = {
    'A': 'ع', 'B': 'ب', 'F': 'ف', 'G': 'غ', 'H': 'ح',
    'I': 'ع', 'J': 'ج', 'K': 'ک', 'M': 'م', 'N': 'ن',
    'P': 'پ', 'Q': 'ق', 'R': 'ر', 'S': 'س', 'T': 'ت',
    'U': 'ع', 'W': 'و', 'Y': 'ی', 'Z': 'ز'
  };
  return map[firstChar] || firstChar;
}

// Height converter (cm to feet & inches)
function formatHeightFeet(cmVal) {
  const cm = parseInt(cmVal, 10);
  if (isNaN(cm) || cm <= 0) return cmVal ? `${cmVal} cm` : 'Not specified';
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${cm} cm (${feet}'${inches}")`;
}

// Seed Matrimonial Profiles
const seedProfiles = [
  {
    fullName: "Saif Khan",
    gender: "Male",
    age: "30 Years",
    height: "169",
    weight: "68 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive",
    motherStatus: "Alive",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Shareef Khan",
    dadaName: "Basheer Khan",
    khandaan: "Khan",
    mohalla: "Madanpura",
    nanihal: "Khan",
    city: "Bangalore",
    profession: "E-Commerce Manager & Performance Marketer",
    managedBy: "Self"
  },
  {
    fullName: "Fatima Bano Ansari",
    gender: "Female",
    age: "23 Years",
    height: "160",
    weight: "52 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive",
    motherStatus: "Alive",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Janab Shamim Ahmad",
    dadaName: "Haji Kallu Seth",
    khandaan: "Kallu Seth Wale",
    mohalla: "Bajardiha",
    nanihal: "Pilikothi",
    city: "Delhi",
    profession: "B.Com, B.Ed Teacher",
    managedBy: "Father"
  }
];

// Seed B2B Listings
const b2bListings = [
  {
    firmName: "Noorani Silk Handloom Karkhana",
    khandaan: "Noorani Weavers",
    owner: "Haji Abdul Rashid & Sons",
    category: "Pure Silk & Kadwa Brocade",
    mohalla: "Madanpura, Banaras",
    capacity: "28 Handlooms | 12 Powerlooms",
    moq: "Min Wholesale Order: 10 Pieces",
    specialties: ["Pure Katan Silk", "Kadwa Weave", "Bridal Banarsi"],
    phone: "+919839123456"
  },
  {
    firmName: "Kallu Seth Wholesale Brocades & Sarees",
    khandaan: "Kallu Seth Wale",
    owner: "Janab Shamim Ahmad Ansari",
    category: "Wholesale Saree Gaddi",
    mohalla: "Bajardiha, Banaras",
    capacity: "Stockist & Pan-India Distribution",
    moq: "Wholesale Only | Sample Sets Available",
    specialties: ["Organza Brocade", "Georgette Khaddi", "Real Zari"],
    phone: "+919839654321"
  }
];

// ==========================================
// 4-DIGIT UNDERLINE OTP & AUTH HANDLERS
// ==========================================
function openAuthModal(mode) {
  document.getElementById('authModal').classList.add('open');
  document.getElementById('phoneView').style.display = 'block';
  document.getElementById('otpView').style.display = 'none';
  document.getElementById('authTitle').innerText = mode === 'register' ? 'Create Free Profile' : 'Welcome Back';
  clearInterval(countdownInterval);
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  clearInterval(countdownInterval);
}

function backToPhoneView() {
  document.getElementById('phoneView').style.display = 'block';
  document.getElementById('otpView').style.display = 'none';
  clearInterval(countdownInterval);
  const input = document.getElementById('mobileInput');
  if (input) input.focus();
}

function startOtpCountdown(seconds = 23) {
  clearInterval(countdownInterval);
  let remaining = seconds;
  const countSpan = document.getElementById('countdownSec');
  const timerBox = document.getElementById('timerBox');
  const resendBtn = document.getElementById('btnResendLink');

  timerBox.style.display = 'inline';
  resendBtn.style.display = 'none';
  countSpan.innerText = remaining + 's';

  countdownInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      timerBox.style.display = 'none';
      resendBtn.style.display = 'inline';
    } else {
      countSpan.innerText = remaining + 's';
    }
  }, 1000);
}

function initOtpInputs() {
  const slots = document.querySelectorAll('.otp-underline-slot');
  slots.forEach((slot, index) => {
    slot.value = '';
    slot.classList.remove('filled');

    slot.oninput = (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val ? val.charAt(val.length - 1) : '';
      if (e.target.value) {
        slot.classList.add('filled');
        if (index < slots.length - 1) {
          slots[index + 1].focus();
        } else {
          setTimeout(verifyOtp, 150);
        }
      } else {
        slot.classList.remove('filled');
      }
    };

    slot.onkeydown = (e) => {
      if (e.key === 'Backspace' && !slot.value && index > 0) {
        slots[index - 1].focus();
        slots[index - 1].value = '';
        slots[index - 1].classList.remove('filled');
      }
    };

    slot.onpaste = (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (!pasteData) return;
      for (let i = 0; i < slots.length; i++) {
        if (i < pasteData.length) {
          slots[i].value = pasteData.charAt(i);
          slots[i].classList.add('filled');
        }
      }
      const focusTarget = Math.min(pasteData.length, slots.length - 1);
      slots[focusTarget].focus();
      if (pasteData.length >= 4) {
        setTimeout(verifyOtp, 150);
      }
    };
  });

  if (slots.length > 0) {
    setTimeout(() => slots[0].focus(), 100);
  }
}

function sendOtp() {
  const p = document.getElementById('mobileInput').value.trim();
  if (!p || p.length < 10) return alert('Please enter a valid 10-digit mobile number.');
  const cleanPhone = p.replace(/^\+91/, '').replace(/\D/g, '');
  const formatted = '+91 ' + cleanPhone;
  document.getElementById('phoneDisplay').innerText = formatted;

  document.getElementById('phoneView').style.display = 'none';
  document.getElementById('otpView').style.display = 'block';

  initOtpInputs();
  startOtpCountdown(23);
}

function resendOtp() {
  initOtpInputs();
  startOtpCountdown(30);
  alert('A new 4-digit verification code has been sent.');
}

function verifyOtp() {
  const slots = document.querySelectorAll('.otp-underline-slot');
  let code = '';
  slots.forEach(s => code += s.value);

  if (code.length < 4) {
    return alert('Please enter all 4 digits of the OTP code.');
  }

  const btnVerify = document.getElementById('btnVerifyOtp');
  if (btnVerify) {
    btnVerify.innerHTML = '<span>Verifying...</span>';
    btnVerify.disabled = true;
  }

  setTimeout(() => {
    if (btnVerify) {
      btnVerify.innerHTML = '<span>Verify & Unlock</span>';
      btnVerify.disabled = false;
    }
    const mobile = document.getElementById('mobileInput').value.trim() || 'Verified Member';
    loginUser('+91 ' + mobile);
  }, 350);
}

function googleLogin() {
  loginUser("Google Member");
}

function emailLogin() {
  const email = prompt("Enter your email address:", "member@banarsijoda.com");
  if (email) loginUser(email);
}

function unlockMemberView() {
  currentUser = { name: "Guest User" };
  document.getElementById('guestGate').style.display = 'none';
  document.getElementById('filterBar').style.display = 'flex';
  document.getElementById('cardsList').style.display = 'grid';
  renderFeed();
}

function loginUser(name) {
  currentUser = { name: name || "Verified Member" };
  closeAuthModal();
  document.getElementById('btnLogin').style.display = 'none';
  document.getElementById('btnReg').style.display = 'none';
  const userPill = document.getElementById('userPill');
  userPill.style.display = 'flex';
  document.getElementById('userName').innerText = currentUser.name.split(' ')[0] || 'Member';
  document.getElementById('userInitial').innerText = (currentUser.name.charAt(0) || 'M').toUpperCase();
  document.getElementById('guestGate').style.display = 'none';
  document.getElementById('filterBar').style.display = 'flex';
  document.getElementById('cardsList').style.display = 'grid';
  renderFeed();
}

// ==========================================
// MULTI-STEP VALIDATION & REGISTRATION
// ==========================================
function proceedStep(currentStep, nextStep) {
  if (currentStep === 1) {
    const g = document.getElementById('inGender').value;
    const n = document.getElementById('inName').value.trim();
    const a = document.getElementById('inAge').value.trim();
    const h = document.getElementById('inHeight').value;
    const w = document.getElementById('inWeight').value;
    if (!g || !n || !a || !h || !w) {
      return alert("Please fill all required personal details (Gender, Name, Age, Height, Weight) to proceed.");
    }
  } else if (currentStep === 2) {
    const m = document.getElementById('inMaritalStatus').value;
    const f = document.getElementById('inFatherStatus').value;
    const mo = document.getElementById('inMotherStatus').value;
    const h = document.getElementById('inHousing').value;
    if (!m || !f || !mo || !h) {
      return alert("Please select all required marital and family status details to proceed.");
    }
  } else if (currentStep === 3) {
    const firqa = document.getElementById('inFirqa').value;
    const walid = document.getElementById('inWalid').value.trim();
    const dada = document.getElementById('inDada').value.trim();
    const khandaan = document.getElementById('inKhandaan').value.trim();
    const mohalla = document.getElementById('inMohalla').value;
    if (!firqa || !walid || !dada || !khandaan || !mohalla) {
      return alert("Please fill all required lineage details (Firqa, Walid Name, Dada Name, Khandaan, Mohalla) to proceed.");
    }
  }
  showStep(nextStep);
}

function showStep(stepIndex) {
  for (let i = 1; i <= 4; i++) {
    const box = document.getElementById('step' + i);
    const tab = document.getElementById('tab' + i);
    if (box) box.style.display = (i === stepIndex) ? 'block' : 'none';
    if (tab) tab.classList.toggle('active', i === stepIndex);
  }
}

function fileChosen(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('photoPreview').src = e.target.result;
      document.getElementById('photoPreviewWrap').style.display = 'flex';
      document.getElementById('photoPlaceholder').style.display = 'none';
      document.getElementById('inPhotoData').value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function removePhoto(e) {
  e.stopPropagation();
  document.getElementById('inFile').value = '';
  document.getElementById('inPhotoData').value = '';
  document.getElementById('photoPreview').src = '';
  document.getElementById('photoPreviewWrap').style.display = 'none';
  document.getElementById('photoPlaceholder').style.display = 'block';
}

function genderChanged() {
  const g = document.getElementById('inGender').value;
  const photoBlock = document.getElementById('malePhotoBlock');
  if (photoBlock) {
    photoBlock.style.display = (g === 'Female') ? 'none' : 'block';
  }
}

function maritalChanged() {
  const s = document.getElementById('inMaritalStatus').value;
  const kidsWrap = document.getElementById('kidsWrap');
  if (kidsWrap) {
    kidsWrap.style.display = (s !== 'Unmarried' && s !== '') ? 'block' : 'none';
  }
}

function openAddModal() {
  document.getElementById('addModal').classList.add('open');
  showStep(1);
  genderChanged();
  maritalChanged();
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('open');
}

function openB2BModal() {
  document.getElementById('b2bModal').classList.add('open');
}

function closeB2BModal() {
  document.getElementById('b2bModal').classList.remove('open');
}

function toggleLineage(id) {
  const el = document.getElementById('lineage-' + id);
  const btn = document.getElementById('btn-lineage-' + id);
  if (!el) return;
  const isOpen = el.style.display === 'block';
  el.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.innerHTML = isOpen ? '▾ View Family Lineage Details' : '▴ Hide Family Lineage Details';
}

function toggleInterest(btn) {
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    btn.innerHTML = '💌 Send Interest';
  } else {
    btn.classList.add('active');
    btn.innerHTML = '✓ Interest Sent';
  }
}

function runMatchFinder() {
  const g = document.getElementById('finderGender').value;
  activeGenderFilter = g;
  ['All', 'Male', 'Female'].forEach(type => {
    const b = document.getElementById('btnFilter' + type);
    if (b) b.classList.toggle('active', type === g);
  });
  if (!currentUser) unlockMemberView();
  renderFeed();
}

function filterByGender(g) {
  activeGenderFilter = g;
  document.getElementById('finderGender').value = g;
  ['All', 'Male', 'Female'].forEach(type => {
    const b = document.getElementById('btnFilter' + type);
    if (b) b.classList.toggle('active', type === g);
  });
  renderFeed();
}

function switchNav(tab) {
  const isDir = (tab === 'directory');
  const isTrade = (tab === 'trade');
  document.getElementById('tabDir').classList.toggle('active', isDir);
  document.getElementById('tabTrade').classList.toggle('active', isTrade);
  document.getElementById('tabNews').classList.toggle('active', tab === 'janaza');

  document.getElementById('matrimonialSection').style.display = isDir ? 'block' : 'none';
  document.getElementById('b2bSection').style.display = isTrade ? 'block' : 'none';

  if (isTrade) renderB2B();
}

// ==========================================
// CARD RENDERING ENGINES
// ==========================================
function renderFeed() {
  const container = document.getElementById('cardsList');
  if (!container) return;

  const list = seedProfiles.filter(p => {
    if (activeGenderFilter === 'All') return true;
    return p.gender === activeGenderFilter;
  });

  document.getElementById('txtCount').innerText = `${list.length} Profiles Available`;

  container.innerHTML = list.map((p, idx) => {
    const isFemale = (p.gender === 'Female');
    const urduLetter = getUrduInitial(p.fullName);
    const displayHeight = formatHeightFeet(p.height);
    const displayWeight = p.weight ? ` • ${p.weight}` : '';

    const photoHtml = isFemale ? `
      <div class="card-photo-box female-tile">
        <div class="arch-top"></div>
        <div class="urdu-initial">${urduLetter}</div>
        <span class="purdah-tag">Purdah Protected</span>
      </div>
    ` : `
      <div class="card-photo-box">
        ${p.photo ? `<img src="${p.photo}" class="card-img" alt="${p.fullName}">` : `<div class="card-avatar-empty"><span>${p.fullName.charAt(0)}</span></div>`}
        <span class="groom-tag">Photo Visible</span>
      </div>
    `;

    return `
      <div class="profile-card">
        <div class="card-row">
          ${photoHtml}
          <div class="card-info">
            <div class="card-name">${p.fullName}</div>
            <div class="card-spec">${p.age} • ${displayHeight}${displayWeight}</div>
            <div class="card-spec">${p.firqa} • ${p.mohalla}</div>
            <div class="card-work">${p.profession || 'Self Employed'}</div>
            <div class="card-managed">Profile created by ${p.managedBy || 'Self'}</div>
          </div>
        </div>

        <div class="lineage-drawer" id="lineage-${idx}">
          <div class="lineage-grid">
            <div><b>Walid:</b> ${p.walidName}</div>
            <div><b>Dada:</b> ${p.dadaName}</div>
            <div><b>Khandaan:</b> ${p.khandaan}</div>
            <div><b>Nanihal:</b> ${p.nanihal || 'Varanasi'}</div>
            <div><b>Housing:</b> ${p.housing}</div>
            <div><b>Marital Status:</b> ${p.maritalStatus}</div>
          </div>
        </div>

        <button class="btn-lineage-toggle" id="btn-lineage-${idx}" onclick="toggleLineage(${idx})">
          ▾ View Family Lineage Details
        </button>

        <div class="card-actions">
          <button class="btn-action btn-interest" onclick="toggleInterest(this)">💌 Send Interest</button>
          <a href="https://wa.me/919611957661?text=Salam,%20inquiring%20about%20profile%20${encodeURIComponent(p.fullName)}" target="_blank" class="btn-action btn-wa">💬 WhatsApp</a>
        </div>
      </div>
    `;
  }).join('');
}

function renderB2B() {
  const container = document.getElementById('b2bCardsList');
  if (!container) return;
  container.innerHTML = b2bListings.map(b => `
    <div class="profile-card">
      <div class="card-name">${b.firmName}</div>
      <div class="card-spec"><b>Khandaan:</b> ${b.khandaan} • <b>Owner:</b> ${b.owner}</div>
      <div class="card-work" style="color: var(--primary); margin: 6px 0;">${b.category} • ${b.mohalla}</div>
      <div class="card-spec">${b.capacity} | ${b.moq}</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin: 10px 0;">
        ${b.specialties.map(s => `<span class="badge" style="background:#ecfdf5; color:#064e3b; font-size:0.75rem; padding:3px 8px; border-radius:6px; font-weight:700;">${s}</span>`).join('')}
      </div>
      <div class="card-actions">
        <a href="https://wa.me/${b.phone.replace(/\D/g,'')}?text=Salam,%20inquiring%20about%20wholesale%20order%20for%20${encodeURIComponent(b.firmName)}" target="_blank" class="btn-action btn-wa" style="text-align:center;">💬 Contact Manufacturer on WhatsApp</a>
      </div>
    </div>
  `).join('');
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================
function saveProfile(e) {
  e.preventDefault();
  const newProfile = {
    fullName: document.getElementById('inName').value.trim(),
    gender: document.getElementById('inGender').value,
    age: document.getElementById('inAge').value.trim() + ' Years',
    height: document.getElementById('inHeight').value,
    weight: document.getElementById('inWeight').value,
    maritalStatus: document.getElementById('inMaritalStatus').value,
    kids: document.getElementById('inKids') ? document.getElementById('inKids').value.trim() : 'None',
    fatherStatus: document.getElementById('inFatherStatus').value,
    motherStatus: document.getElementById('inMotherStatus').value,
    housing: document.getElementById('inHousing').value,
    firqa: document.getElementById('inFirqa').value,
    walidName: document.getElementById('inWalid').value.trim(),
    dadaName: document.getElementById('inDada').value.trim(),
    khandaan: document.getElementById('inKhandaan').value.trim(),
    mohalla: document.getElementById('inMohalla').value,
    nanihal: document.getElementById('inNanihal').value.trim(),
    city: document.getElementById('inCity').value.trim() || 'Varanasi',
    profession: document.getElementById('inWork').value.trim(),
    managedBy: document.getElementById('inManagedBy').value,
    photo: document.getElementById('inPhotoData').value || null
  };

  seedProfiles.unshift(newProfile);
  closeAddModal();
  loginUser(newProfile.fullName);
  alert('Alhamdulillah! Your matrimonial profile has been submitted successfully.');
}

function saveB2B(e) {
  e.preventDefault();
  const newB2b = {
    firmName: document.getElementById('b2bFirm').value.trim(),
    owner: document.getElementById('b2bOwner').value.trim(),
    khandaan: document.getElementById('b2bKhandaan').value.trim(),
    category: document.getElementById('b2bCat').value,
    mohalla: document.getElementById('b2bMohalla').value,
    capacity: document.getElementById('b2bCap').value.trim(),
    moq: document.getElementById('b2bMoq').value.trim(),
    specialties: document.getElementById('b2bSpec').value.split(',').map(s => s.trim()),
    phone: document.getElementById('b2bPhone').value.trim()
  };
  b2bListings.unshift(newB2b);
  closeB2BModal();
  renderB2B();
  alert('B2B Firm registered successfully.');
}

// Populate Height Options (140 cm to 200 cm)
(function initHeightOptions() {
  const hSelect = document.getElementById('inHeight');
  if (!hSelect) return;
  for (let cm = 140; cm <= 200; cm++) {
    const opt = document.createElement('option');
    opt.value = cm;
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    opt.textContent = `${cm} cm (${feet}'${inches}")`;
    if (cm === 168) opt.selected = true;
    hSelect.appendChild(opt);
  }
})();
