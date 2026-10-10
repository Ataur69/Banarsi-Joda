function cleanPhone(p) { return (p || '').replace(/\D/g, ''); }
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
    fullName: "Mohammad Saif Khan",
    gender: "Male",
    age: "30 Years",
    height: "169",
    weight: "68 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Trader)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Shareef Khan",
    dadaName: "Basheer Khan",
    khandaan: "Seedhe Sattar",
    mohalla: "Madanpura",
    nanihal: "Bajardiha",
    city: "Varanasi",
    profession: "Process (Saree Processing & Finishing)",
    education: "Intermediate (12th Pass)",
    income: "5 - 7 Lakh yearly",
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
    fatherStatus: "Alive (Handloom Karkhanedar)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Janab Shamim Ahmad",
    dadaName: "Haji Usman Ansari",
    khandaan: "Usman Chutar",
    mohalla: "Bajardiha",
    nanihal: "Pilikothi",
    city: "Varanasi",
    profession: "Homemaker & Islamic Aalimat",
    education: "Aalimat & Intermediate (12th)",
    income: "Not Disclosed",
    managedBy: "Father"
  },
  {
    fullName: "Zaid Majeed Ansari",
    gender: "Male",
    age: "27 Years",
    height: "172",
    weight: "67 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Weaver)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Abdul Majeed",
    dadaName: "Haji Ramzan Ansari",
    khandaan: "Majeed Taatu",
    mohalla: "Alaipura",
    nanihal: "Lohta",
    city: "Varanasi",
    profession: "Job Work (Karigari & Weaving)",
    education: "Can Read Urdu & Arabic",
    income: "4 - 6 Lakh yearly",
    managedBy: "Father"
  },
  {
    fullName: "Zainab Khatoon",
    gender: "Female",
    age: "24 Years",
    height: "155",
    weight: "48 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Gaddi Owner)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Haji Idrees Ansari",
    dadaName: "Janab Noor Mohammad",
    khandaan: "Idrees Bhaand",
    mohalla: "Pilikothi",
    nanihal: "Madanpura",
    city: "Varanasi",
    profession: "Homemaker (Tailoring & Zari Work)",
    education: "Can Read Urdu & Arabic",
    income: "Not Disclosed",
    managedBy: "Mother"
  },
  {
    fullName: "Bilal Kallu Ansari",
    gender: "Male",
    age: "28 Years",
    height: "170",
    weight: "68 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Karkhanedar)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Haji Kallu Seth",
    dadaName: "Seth Abdul Shakoor",
    khandaan: "Kallu Haji",
    mohalla: "Bajardiha",
    nanihal: "Alaipura",
    city: "Varanasi",
    profession: "Kadwa Brocade Manufacturer & Wholesale",
    education: "Intermediate (12th)",
    income: "6 - 8 Lakh yearly",
    managedBy: "Father"
  },
  {
    fullName: "Ayesha Parveen",
    gender: "Female",
    age: "22 Years",
    height: "158",
    weight: "50 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Loom Owner)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl-e-Hadees",
    walidName: "Janab Babu Ansari",
    dadaName: "Janab Ghulam Rasool",
    khandaan: "Chote Mu Ke Babu",
    mohalla: "Lohta",
    nanihal: "Bajardiha",
    city: "Varanasi",
    profession: "Homemaker & Quranic Tutor",
    education: "Hafiza & 10th Pass",
    income: "Under 3 Lakh yearly",
    managedBy: "Father"
  },
  {
    fullName: "Hamza Ghaffar Ansari",
    gender: "Male",
    age: "29 Years",
    height: "174",
    weight: "72 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Muneem / Accountant)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Abdul Ghaffar",
    dadaName: "Haji Altaf Hussain",
    khandaan: "Muneem Ke Ghaffar",
    mohalla: "Madanpura",
    nanihal: "Pilikothi",
    city: "Varanasi",
    profession: "Saree Firm Accounts & Commission Agent",
    education: "B.Com (Accounts)",
    income: "5 - 7 Lakh yearly",
    managedBy: "Self"
  },
  {
    fullName: "Mariam Bano",
    gender: "Female",
    age: "25 Years",
    height: "156",
    weight: "51 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Weaver)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Sattar Ansari",
    dadaName: "Haji Barkatullah",
    khandaan: "Seedhe Sattar",
    mohalla: "Madanpura",
    nanihal: "Adampura",
    city: "Varanasi",
    profession: "Homemaker",
    education: "Intermediate (12th Pass)",
    income: "Not Disclosed",
    managedBy: "Mother"
  },
  {
    fullName: "Tariq Usman Ansari",
    gender: "Male",
    age: "26 Years",
    height: "167",
    weight: "64 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Karkhanedar)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Haji Usman Ghani",
    dadaName: "Janab Raheem Bakhsh",
    khandaan: "Usman Chutar",
    mohalla: "Bajardiha",
    nanihal: "Alaipura",
    city: "Surat",
    profession: "Banarasi Saree Wholesale Distribution",
    education: "10th Pass & Family Business",
    income: "5 - 7 Lakh yearly",
    managedBy: "Brother"
  },
  {
    fullName: "Sara Khatoon",
    gender: "Female",
    age: "21 Years",
    height: "152",
    weight: "46 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Weaver)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Majeed Ahmad",
    dadaName: "Haji Yasin Ansari",
    khandaan: "Majeed Taatu",
    mohalla: "Alaipura",
    nanihal: "Pilikothi",
    city: "Varanasi",
    profession: "Homemaker",
    education: "Can Read Urdu & Arabic",
    income: "Not Disclosed",
    managedBy: "Father"
  },
  {
    fullName: "Rizwan Idrees Ansari",
    gender: "Male",
    age: "31 Years",
    height: "173",
    weight: "70 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Merchant)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Haji Idrees Bakhsh",
    dadaName: "Janab Burhanuddin",
    khandaan: "Idrees Bhaand",
    mohalla: "Pilikothi",
    nanihal: "Bajardiha",
    city: "Mumbai",
    profession: "Freelancer (Textile Designer)",
    education: "Intermediate (12th)",
    income: "6 - 8 Lakh yearly",
    managedBy: "Self"
  },
  {
    fullName: "Nida Bano",
    gender: "Female",
    age: "23 Years",
    height: "160",
    weight: "52 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Loom Owner)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Kallu Ansari",
    dadaName: "Haji Kazim Ali",
    khandaan: "Kallu Haji",
    mohalla: "Bajardiha",
    nanihal: "Madanpura",
    city: "Varanasi",
    profession: "Homemaker & Hand Embroidery",
    education: "Intermediate (12th Pass)",
    income: "Not Disclosed",
    managedBy: "Father"
  },
  {
    fullName: "Farhan Babu Ansari",
    gender: "Male",
    age: "28 Years",
    height: "168",
    weight: "65 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Powerloom Owner)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl-e-Hadees",
    walidName: "Janab Babu Ansari",
    dadaName: "Seth Mohammad Ishaq",
    khandaan: "Chote Mu Ke Babu",
    mohalla: "Lohta",
    nanihal: "Alaipura",
    city: "Varanasi",
    profession: "Powerloom Silk Weaving (8 Looms)",
    education: "10th Pass (Family Business)",
    income: "5 - 7 Lakh yearly",
    managedBy: "Father"
  },
  {
    fullName: "Sana Parveen",
    gender: "Female",
    age: "24 Years",
    height: "156",
    weight: "49 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Accountant)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Abdul Ghaffar",
    dadaName: "Haji Abdul Wahid",
    khandaan: "Muneem Ke Ghaffar",
    mohalla: "Madanpura",
    nanihal: "Lohta",
    city: "Varanasi",
    profession: "Homemaker & Home Tuitions",
    education: "BA (Pass)",
    income: "Under 3 Lakh yearly",
    managedBy: "Father"
  },
  {
    fullName: "Owais Sattar Ansari",
    gender: "Male",
    age: "25 Years",
    height: "171",
    weight: "66 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Weaver)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Sattar Khan",
    dadaName: "Haji Ibrahim Ansari",
    khandaan: "Seedhe Sattar",
    mohalla: "Madanpura",
    nanihal: "Bajardiha",
    city: "Bengaluru",
    profession: "Textile Saree Retail & Wholesale",
    education: "Intermediate (12th Pass)",
    income: "5 - 7 Lakh yearly",
    managedBy: "Self"
  },
  {
    fullName: "Hiba Khatoon",
    gender: "Female",
    age: "22 Years",
    height: "162",
    weight: "50 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Artisan)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Janab Usman Bakhsh",
    dadaName: "Haji Yaseen Seth",
    khandaan: "Usman Chutar",
    mohalla: "Bajardiha",
    nanihal: "Pilikothi",
    city: "Varanasi",
    profession: "Homemaker",
    education: "Can Read Urdu & Arabic",
    income: "Not Disclosed",
    managedBy: "Mother"
  },
  {
    fullName: "Danish Majeed Ansari",
    gender: "Male",
    age: "29 Years",
    height: "175",
    weight: "71 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Exporter)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Haji Majeed Ahmad",
    dadaName: "Janab Sulaiman Seth",
    khandaan: "Majeed Taatu",
    mohalla: "Alaipura",
    nanihal: "Reori Talab",
    city: "Kolkata",
    profession: "Wholesale Saree Gaddi Arhat",
    education: "12th Pass",
    income: "7 - 10 Lakh yearly",
    managedBy: "Self"
  },
  {
    fullName: "Sumaiya Bano",
    gender: "Female",
    age: "23 Years",
    height: "154",
    weight: "47 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Weaver)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Deobandi",
    walidName: "Janab Idrees Ansari",
    dadaName: "Haji Niamatullah",
    khandaan: "Idrees Bhaand",
    mohalla: "Pilikothi",
    nanihal: "Madanpura",
    city: "Varanasi",
    profession: "Homemaker & Quranic Teacher",
    education: "Hafiza & 10th",
    income: "Not Disclosed",
    managedBy: "Brother"
  },
  {
    fullName: "Imran Kallu Ansari",
    gender: "Male",
    age: "32 Years",
    height: "172",
    weight: "69 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Karkhanedar)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Haji Kallu Seth",
    dadaName: "Janab Badruddin",
    khandaan: "Kallu Haji",
    mohalla: "Bajardiha",
    nanihal: "Pilikothi",
    city: "Hyderabad",
    profession: "Saree Retail & Distribution Shop",
    education: "Intermediate (12th)",
    income: "6 - 8 Lakh yearly",
    managedBy: "Self"
  },
  {
    fullName: "Alina Ghaffar",
    gender: "Female",
    age: "21 Years",
    height: "157",
    weight: "49 kg",
    maritalStatus: "Unmarried",
    kids: "None",
    fatherStatus: "Alive (Muneem / Accountant)",
    motherStatus: "Alive (Homemaker)",
    housing: "Own House",
    firqa: "Ahl us Sunnah",
    walidName: "Janab Abdul Ghaffar",
    dadaName: "Haji Fazl-ur-Rahman",
    khandaan: "Muneem Ke Ghaffar",
    mohalla: "Madanpura",
    nanihal: "Bajardiha",
    city: "Varanasi",
    profession: "Homemaker",
    education: "Intermediate (12th Pass)",
    income: "Not Disclosed",
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

function loginUser(name, phone) {
  const displayName = name || "Saif Khan";
  const displayPhone = phone || (document.getElementById('mobileInput') ? '+91 ' + document.getElementById('mobileInput').value.trim() : '+91 96119 57661');
  currentUser = { name: displayName, phone: displayPhone };
  closeAuthModal();

  // Update Header UI
  document.getElementById('btnLogin').style.display = 'none';
  document.getElementById('btnReg').style.display = 'none';
  const userPillWrap = document.getElementById('userPillWrap');
  if (userPillWrap) userPillWrap.style.display = 'block';

  const isPhone = displayName.startsWith('+') || /^\d+$/.test(displayName.replace(/\D/g, ''));
  const shortName = isPhone ? 'Member' : (displayName.split(' ')[0] || 'Member');
  const initial = (!isPhone && displayName.charAt(0).match(/[a-zA-Z]/)) ? displayName.charAt(0).toUpperCase() : null;
  
  document.getElementById('userName').innerText = isPhone ? displayName : shortName;

  // Retrieve user's existing profile to calculate completion score
  let activeProfile = null;
  try {
    const saved = localStorage.getItem('banarsi_my_profile');
    if (saved) activeProfile = JSON.parse(saved);
  } catch(e) {}
  if (!activeProfile) {
    activeProfile = seedProfiles.find(p => p.phone && cleanPhone(p.phone) === cleanPhone(displayPhone));
  }
  const completionScore = getProfileCompletionScore(activeProfile);
  updateProfileProgressUI(completionScore, completionScore >= 100);

  const dropName = document.getElementById('dropdownName');
  if (dropName) dropName.innerText = displayName;
  
  const dropAvatar = document.getElementById('dropdownAvatar');
  if (dropAvatar) {
    dropAvatar.innerHTML = initial ? initial : '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
  }

  const accModalAvatar = document.getElementById('accModalAvatar');
  if (accModalAvatar) {
    accModalAvatar.innerHTML = initial ? initial : '<svg viewBox="0 0 24 24" width="38" height="38" stroke="var(--gold-border)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
  }

  // Reveal Directory Feed
  document.getElementById('guestGate').style.display = 'none';
  document.getElementById('filterBar').style.display = 'flex';
  document.getElementById('cardsList').style.display = 'grid';
  renderFeed();
}

// ==========================================
// MULTI-STEP VALIDATION & REGISTRATION
// ==========================================
function proceedStep(cur, nxt) {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  let valid = true;
  let firstEl = null;

  if (cur === 1) {
    const name = document.getElementById('inName');
    const age = document.getElementById('inAge');
    const height = document.getElementById('inHeight');
    if (!name.value.trim()) { name.classList.add('field-error'); valid = false; if (!firstEl) firstEl = name; }
    if (!age.value.trim()) { age.classList.add('field-error'); valid = false; if (!firstEl) firstEl = age; }
    if (!height.value) { height.classList.add('field-error'); valid = false; if (!firstEl) firstEl = height; }
  }
  if (cur === 2) {
    const marital = document.getElementById('inMaritalStatus').value;
    const kids = document.getElementById('inKids');
    if (marital !== 'Unmarried' && !kids.value.trim()) { kids.classList.add('field-error'); valid = false; if (!firstEl) firstEl = kids; }
  }
  if (cur === 3) {
    const walid = document.getElementById('inWalid');
    const dada = document.getElementById('inDada');
    const khandaan = document.getElementById('inKhandaan');
    const mohalla = document.getElementById('inMohalla');
    if (!walid.value.trim()) { walid.classList.add('field-error'); valid = false; if (!firstEl) firstEl = walid; }
    if (!dada.value.trim()) { dada.classList.add('field-error'); valid = false; if (!firstEl) firstEl = dada; }
    if (!khandaan.value.trim()) { khandaan.classList.add('field-error'); valid = false; if (!firstEl) firstEl = khandaan; }
    if (!mohalla.value) { mohalla.classList.add('field-error'); valid = false; if (!firstEl) firstEl = mohalla; }
  }

  if (!valid) {
    alert('Please fill in all mandatory fields before proceeding to the next page.');
    if (firstEl) firstEl.focus();
    return false;
  }
  showStep(nxt);
  return true;
}

function showStep(s) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`step${i}`);
    const tab = document.getElementById(`tab${i}`);
    if (el) el.style.display = (i === s) ? 'flex' : 'none';
    if (tab) tab.classList.toggle('active', i === s);
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
  const g = document.getElementById('inGender') ? document.getElementById('inGender').value : 'Male';
  const groomSec = document.getElementById('groomPhotoSection');
  const brideSec = document.getElementById('bridePardahSection');
  const step7Title = document.getElementById('step7Title');
  const step7Sub = document.getElementById('step7Sub');
  const step7Badge = document.getElementById('step7Badge');
  const mSelect = document.getElementById('inMaritalStatus');

  if (g === 'Female') {
    // AUTOMATICALLY NO PHOTO FOR BRIDES
    if (groomSec) groomSec.style.display = 'none';
    if (brideSec) {
      brideSec.style.display = 'block';
      const nameVal = document.getElementById('inName') ? document.getElementById('inName').value : '';
      const urduInitialEl = document.getElementById('regPardahUrduInitial');
      if (urduInitialEl) urduInitialEl.innerText = getUrduInitial(nameVal || 'Fatima');
    }
    if (step7Title) step7Title.innerText = 'Pardah Protection & Verification';
    if (step7Sub) step7Sub.innerText = 'Sister profiles are strictly Pardah Protected with royal Urdu calligraphy';
    if (step7Badge) step7Badge.innerText = '🛡️';
    
    removePhoto();
    if (mSelect) mSelect.innerHTML = '<option value="Unmarried">Never Married (Ghair Shaadishuda)</option><option value="Widowed">Widow (Bewa)</option><option value="Divorced">Divorced (Talaq-shuda)</option>';
  } else {
    // GROOMS: PHOTO UPLOAD ENABLED
    if (groomSec) groomSec.style.display = 'block';
    if (brideSec) brideSec.style.display = 'none';
    if (step7Title) step7Title.innerText = 'Upload Photo';
    if (step7Sub) step7Sub.innerText = 'Profiles with authentic photos receive up to 5x more genuine responses';
    if (step7Badge) step7Badge.innerText = '📷';
    if (mSelect) mSelect.innerHTML = '<option value="Unmarried">Never Married (Ghair Shaadishuda)</option><option value="Married (Shadi Shuda)">Married (Shadi Shuda)</option><option value="Widowed">Widower (Bewa)</option><option value="Divorced">Divorced (Talaq-shuda)</option>';
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
  showRegStep(1);
  genderChanged();
  maritalChanged();

  // If user already has an active profile, PRE-FILL the fields to edit in-place
  let myProfile = null;
  try {
    const saved = localStorage.getItem('banarsi_my_profile');
    if (saved) myProfile = JSON.parse(saved);
  } catch (e) {}

  if (!myProfile && currentUser && currentUser.phone) {
    myProfile = seedProfiles.find(p => p.phone && p.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, ''));
  }

  if (myProfile) {
    if (document.getElementById('inManagedBy') && myProfile.managedBy) {
      document.getElementById('inManagedBy').value = myProfile.managedBy;
      document.querySelectorAll('#managedByChips .reg-chip').forEach(c => {
        const txt = c.innerText.toLowerCase();
        const mb = myProfile.managedBy.toLowerCase();
        const isMatch = (mb.includes('self') && txt.includes('myself')) ||
                        (mb.includes('father') && txt.includes('father')) ||
                        (mb.includes('wali') && txt.includes('wali'));
        c.classList.toggle('active', isMatch);
      });
    }
    if (document.getElementById('inName')) document.getElementById('inName').value = myProfile.fullName || '';
    if (document.getElementById('inAge')) document.getElementById('inAge').value = myProfile.age || '';
    if (document.getElementById('inWalid')) document.getElementById('inWalid').value = myProfile.walidName || '';
    if (document.getElementById('inDada')) document.getElementById('inDada').value = myProfile.dadaName || '';
    if (document.getElementById('inKhandaan')) document.getElementById('inKhandaan').value = myProfile.khandaan || '';
    if (document.getElementById('inMohalla')) document.getElementById('inMohalla').value = myProfile.mohalla || '';
    if (document.getElementById('inCity')) document.getElementById('inCity').value = myProfile.city || '';
    if (document.getElementById('inPhone')) document.getElementById('inPhone').value = myProfile.phone || '';
    if (document.getElementById('inEducation')) document.getElementById('inEducation').value = myProfile.education || '12th Pass (Intermediate)';
    if (document.getElementById('inWork')) {
      document.getElementById('inWork').value = myProfile.profession || '';
      professionChanged();
    }
    const btnSub = document.getElementById('btnSubmit');
    if (btnSub) btnSub.innerText = 'Update Profile & Save';
  } else {
    const btnSub = document.getElementById('btnSubmit');
    if (btnSub) btnSub.innerText = 'Complete Profile & Save';
  }
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

function toggleInterest(btn, encodedName) {
  const isInterested = btn.classList.toggle('interested');
  const span = btn.querySelector('span');
  if (span) {
    span.innerText = isInterested ? 'Interested' : 'Interest';
  }
  
  // Real-time counter for My Account dashboard
  const countSpan = document.getElementById('statShortlisted');
  if (countSpan) {
    countSpan.innerText = document.querySelectorAll('.btn-interest.interested').length;
  }
}

// ==========================================
// MULTI-CRITERIA MATCH FINDER ENGINE (Gender, Age, Firqa, Location)
// ==========================================
let activeSearchFilters = {
  gender: 'All',
  ageRange: 'all',
  firqa: 'all',
  location: 'all'
};

function runMatchFinder() {
  const g = document.getElementById('finderGender') ? document.getElementById('finderGender').value : 'All';
  const a = document.getElementById('finderAgeRange') ? document.getElementById('finderAgeRange').value : 'all';
  const f = document.getElementById('finderFirqa') ? document.getElementById('finderFirqa').value : 'all';
  const l = document.getElementById('finderLocation') ? document.getElementById('finderLocation').value : 'all';

  activeGenderFilter = g;
  activeSearchFilters = { gender: g, ageRange: a, firqa: f, location: l };

  ['All', 'Male', 'Female'].forEach(type => {
    const b = document.getElementById('btnFilter' + type);
    if (b) b.classList.toggle('active', type === g);
  });

  if (!currentUser) unlockMemberView();
  renderFeed();
}

function filterByGender(g) {
  activeGenderFilter = g;
  activeSearchFilters.gender = g;
  const gSelect = document.getElementById('finderGender');
  if (gSelect) gSelect.value = g;

  ['All', 'Male', 'Female'].forEach(type => {
    const b = document.getElementById('btnFilter' + type);
    if (b) b.classList.toggle('active', type === g);
  });
  renderFeed();
}

function renderFeed() {
  const container = document.getElementById('cardsList');
  if (!container) return;

  const seenMap = new Set();
  const deduplicatedProfiles = seedProfiles.filter(p => {
    const key = ((p.phone || '') + '_' + (p.fullName || '')).toLowerCase().replace(/\s+/g, '');
    if (seenMap.has(key)) return false;
    seenMap.add(key);
    return true;
  });

  const list = deduplicatedProfiles.filter(p => {
    // 1. Gender Filter
    if (activeSearchFilters.gender !== 'All' && p.gender !== activeSearchFilters.gender) {
      return false;
    }

    // 2. Firqa Filter (Matches Registration: Ahl us Sunnah, Deobandi, Ahl-e-Hadees, Ahl-e-Tashayyo)
    if (activeSearchFilters.firqa && activeSearchFilters.firqa !== 'all') {
      const targetFirqa = activeSearchFilters.firqa.toLowerCase();
      const pFirqa = (p.firqa || '').toLowerCase();
      if (!pFirqa.includes(targetFirqa) && !targetFirqa.includes(pFirqa)) {
        return false;
      }
    }

    // 3. Location / City Filter (Pan-India Cities where Banarsi community resides)
    if (activeSearchFilters.location && activeSearchFilters.location !== 'all') {
      const loc = activeSearchFilters.location.toLowerCase();
      const pCity = (p.city || '').toLowerCase();
      const pMohalla = (p.mohalla || '').toLowerCase();

      if (loc === 'varanasi') {
        if (!pCity.includes('varanasi') && !pCity.includes('banaras') && !pMohalla) {
          return false;
        }
      } else if (loc === 'bengaluru') {
        if (!pCity.includes('bengaluru') && !pCity.includes('bangalore')) {
          return false;
        }
      } else if (loc === 'delhi') {
        if (!pCity.includes('delhi') && !pCity.includes('noida') && !pCity.includes('gurgaon')) {
          return false;
        }
      } else if (loc === 'mumbai') {
        if (!pCity.includes('mumbai') && !pCity.includes('thane')) {
          return false;
        }
      } else {
        if (!pCity.includes(loc)) {
          return false;
        }
      }
    }

    // 4. Age Range Filter
    if (activeSearchFilters.ageRange && activeSearchFilters.ageRange !== 'all') {
      const ageNum = parseInt((p.age || '').replace(/\D/g, ''), 10);
      if (!isNaN(ageNum)) {
        if (activeSearchFilters.ageRange === '18-24' && (ageNum < 18 || ageNum > 24)) return false;
        if (activeSearchFilters.ageRange === '25-30' && (ageNum < 25 || ageNum > 30)) return false;
        if (activeSearchFilters.ageRange === '31-38' && (ageNum < 31 || ageNum > 38)) return false;
        if (activeSearchFilters.ageRange === '39+' && ageNum < 39) return false;
      }
    }

    return true;
  });

  document.getElementById('txtCount').innerText = `${list.length} Profiles Available`;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 16px; background: white; border: 1.5px dashed var(--border); border-radius: 16px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
        <h4 style="font-size: 1.1rem; color: var(--primary-dark); font-weight: 800; margin-bottom: 4px;">No Exact Matches Found</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">Try changing the Location or Maslak filter to broaden your search.</p>
        <button class="btn-apple-primary" style="max-width: 200px; margin: 0 auto;" onclick="resetSearchFilters()">View All Profiles</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((p, idx) => {
    const isFemale = (p.gender === 'Female');
    const urduLetter = getUrduInitial(p.fullName);
    const displayHeight = formatHeightFeet(p.height);
    const displayWeight = p.weight ? ` • ${p.weight}` : '';

    const photoHtml = isFemale ? `
      <div class="card-photo-box female-tile">
        <div class="arch-top"></div>
        <div class="urdu-initial">${urduLetter}</div>
        <span class="pardah-tag">Pardah Protected</span>
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
            
            <!-- Focused Firqa & Distinct Banaras Origin Place Badges -->
            <div class="card-meta-focus-row">
              <span class="firqa-highlight-badge">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>${p.firqa}</span>
              </span>

              <span class="banaras-origin-badge">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span><b>${p.mohalla}</b>, Banaras</span>
              </span>
            </div>

            <div class="card-spec" style="font-size: 0.8rem; color: #475569; margin-top: 2px;">
              Khandaan: <b style="color: var(--brown);">${p.khandaan}</b> • Living in <b>${p.city || 'Varanasi'}</b>
            </div>
            <div class="card-work">💼 ${p.profession}</div>
            <div class="card-managed">🎓 ${p.education || 'Intermediate'} • Created by ${p.managedBy || 'Family'}</div>
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
          <button type="button" class="btn-action btn-interest" onclick="toggleInterest(this, '${encodeURIComponent(p.fullName)}')">
            <svg class="heart-icon" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Interest</span>
          </button>
          <button type="button" class="btn-action btn-share" onclick="handleShare('${encodeURIComponent(p.fullName)}', '${p.age || ''}', '${p.city || p.mohalla || ''}')">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function resetSearchFilters() {
  activeSearchFilters = { gender: 'All', ageRange: 'all', firqa: 'all', location: 'all' };
  activeGenderFilter = 'All';
  if (document.getElementById('finderGender')) document.getElementById('finderGender').value = 'All';
  if (document.getElementById('finderAgeRange')) document.getElementById('finderAgeRange').value = 'all';
  if (document.getElementById('finderFirqa')) document.getElementById('finderFirqa').value = 'all';
  if (document.getElementById('finderLocation')) document.getElementById('finderLocation').value = 'all';
  ['All', 'Male', 'Female'].forEach(type => {
    const b = document.getElementById('btnFilter' + type);
    if (b) b.classList.toggle('active', type === 'All');
  });
  renderFeed();
}

function renderB2B() {
  const container = document.getElementById('b2bCardsList');
  if (!container) return;
  container.innerHTML = b2bListings.map(b => `
    <div class="b2b-card">
      <div class="b2b-card-header">
        <div>
          <div class="b2b-firm-name">${b.firmName}</div>
          <div class="b2b-meta-line">
            <span class="b2b-cat-badge">${b.category}</span>
            <span>•</span>
            <span class="b2b-loc">
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${b.mohalla}
            </span>
          </div>
        </div>
        <span class="b2b-verified-tag">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="#10b981">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 14.54L6.7 12.3a.75.75 0 0 1 1.06-1.06l3.18 3.18 6.36-6.36a.75.75 0 0 1 1.06 1.06l-7.42 7.42z"/>
          </svg>
          Verified
        </span>
      </div>

      <div class="b2b-info-list">
        <div class="b2b-info-row">
          <span class="b2b-info-lbl">Owner / Lineage</span>
          <span class="b2b-info-val">${b.owner} <span class="khandaan-tag">(${b.khandaan})</span></span>
        </div>
        <div class="b2b-info-row">
          <span class="b2b-info-lbl">Production Capacity</span>
          <span class="b2b-info-val">${b.capacity}</span>
        </div>
        <div class="b2b-info-row">
          <span class="b2b-info-lbl">Minimum Order (MOQ)</span>
          <span class="b2b-info-val">${b.moq}</span>
        </div>
      </div>

      <div class="b2b-tags-wrap">
        ${b.specialties.map(s => `<span class="b2b-tag">${s}</span>`).join('')}
      </div>

      <div class="b2b-actions-row">
        <button type="button" class="btn-chat-primary" onclick="openInWebChat('${encodeURIComponent(b.firmName)}', '${encodeURIComponent(b.owner)}')">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Chat</span>
        </button>
        <button type="button" class="btn-b2b-share" onclick="handleShare('${encodeURIComponent(b.firmName)}', '${encodeURIComponent(b.category)}', '${encodeURIComponent(b.mohalla)}')">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
            <polyline points="16 6 12 2 8 6"></polyline>
            <line x1="12" y1="2" x2="12" y2="15"></line>
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================
function saveProfile(e) {
  e.preventDefault();
  const rawWork = document.getElementById('inWork').value;
  const customWork = document.getElementById('inWorkCustom') ? document.getElementById('inWorkCustom').value.trim() : '';
  const finalProfession = (rawWork === 'Other' && customWork) ? customWork : (rawWork || 'Weaver');

  const userPhone = document.getElementById('inPhone').value.trim();
  const userName = document.getElementById('inName').value.trim();

  const newProfile = {
    fullName: userName,
    gender: document.getElementById('inGender').value,
    managedBy: document.getElementById('inManagedBy').value,
    age: document.getElementById('inAge').value.trim(),
    firqa: document.getElementById('inFirqa').value,
    walidName: document.getElementById('inWalid').value.trim(),
    dadaName: document.getElementById('inDada').value.trim(),
    khandaan: document.getElementById('inKhandaan').value.trim(),
    mohalla: document.getElementById('inMohalla').value,
    nanihal: document.getElementById('inNanihal') ? document.getElementById('inNanihal').value.trim() : 'Banaras',
    city: document.getElementById('inCity').value.trim() || 'Varanasi',
    maritalStatus: document.getElementById('inMaritalStatus').value,
    kids: document.getElementById('inKids') ? document.getElementById('inKids').value.trim() : 'None',
    height: document.getElementById('inHeight').value,
    weight: document.getElementById('inWeight').value,
    diet: document.getElementById('inDiet') ? document.getElementById('inDiet').value : 'Non-Veg',
    disability: document.getElementById('inDisability').value,
    income: document.getElementById('inIncome') ? document.getElementById('inIncome').value : '7 - 10 Lakh yearly',
    workWith: document.getElementById('inWorkWith') ? document.getElementById('inWorkWith').value : 'Business / Handloom Karkhana',
    profession: finalProfession,
    company: document.getElementById('inCompany') ? document.getElementById('inCompany').value.trim() : '',
    education: document.getElementById('inEducation') ? document.getElementById('inEducation').value : '12th Pass (Intermediate)',
    fatherStatus: document.getElementById('inFatherStatus').value,
    motherStatus: document.getElementById('inMotherStatus').value,
    brothers: document.getElementById('inBrothers') ? document.getElementById('inBrothers').value : 'None',
    sisters: document.getElementById('inSisters') ? document.getElementById('inSisters').value : 'None',
    familyFinance: document.getElementById('inFamilyFinance') ? document.getElementById('inFamilyFinance').value : 'Middle Class',
    housing: document.getElementById('inHousing').value,
    hobbies: document.getElementById('inHobbies') ? document.getElementById('inHobbies').value : 'Textile & Sarees, Reading',
    phone: userPhone,
    photo: document.getElementById('inPhotoData') ? document.getElementById('inPhotoData').value : null
  };

  // STRICT ANTI-DUPLICATE CHECK: Update existing profile if already exists
  const existingIdx = seedProfiles.findIndex(p => {
    const cleanP1 = (p.phone || '').replace(/\D/g, '');
    const cleanP2 = userPhone.replace(/\D/g, '');
    if (cleanP1 && cleanP2 && cleanP1 === cleanP2) return true;
    if (currentUser && currentUser.phone && p.phone && p.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) return true;
    if (p.fullName.toLowerCase() === userName.toLowerCase() && p.walidName.toLowerCase() === newProfile.walidName.toLowerCase()) return true;
    return false;
  });

  if (existingIdx !== -1) {
    // UPDATE IN PLACE: DO NOT CREATE DUPLICATE!
    seedProfiles[existingIdx] = { ...seedProfiles[existingIdx], ...newProfile };
    alert('Alhamdulillah! Your verified profile has been updated successfully.');
  } else {
    // ADD NEW UNIQUE PROFILE
    seedProfiles.unshift(newProfile);
    alert('Alhamdulillah! Your verified matrimonial profile has been created successfully.');
  }

  // Deduplicate array permanently
  const seenKeys = new Set();
  const cleanedList = [];
  seedProfiles.forEach(p => {
    const key = ((p.phone || '') + '_' + (p.fullName || '')).toLowerCase().replace(/\s+/g, '');
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      cleanedList.push(p);
    }
  });
  seedProfiles.length = 0;
  cleanedList.forEach(p => seedProfiles.push(p));

  // Store in LocalStorage for current device
  try {
    localStorage.setItem('banarsi_my_profile', JSON.stringify(newProfile));
  } catch (err) {}

  updateProfileProgressUI(getProfileCompletionScore(newProfile), getProfileCompletionScore(newProfile) >= 100);
  closeAddModal();
  loginUser(newProfile.fullName, newProfile.phone);
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
  hSelect.innerHTML = '<option value="">Select Height in cm / ft</option>';
  // Starting from 4 feet (122 cm) up to 7 feet (214 cm)
  for (let cm = 122; cm <= 214; cm += 2) {
    const opt = document.createElement('option');
    opt.value = cm;
    const totalInches = Math.round(cm / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    opt.textContent = `${feet}' ${inches}" (${cm} cm)`;
    hSelect.appendChild(opt);
  }
})();


// ==========================================
// ACCOUNT MANAGEMENT & LOGOUT LOGIC
// ==========================================
function toggleAccountDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('accountDropdown');
  const pill = document.getElementById('userPill');
  if (!dropdown) return;
  const isShowing = dropdown.classList.contains('show');
  if (isShowing) {
    closeAccountDropdown();
  } else {
    dropdown.classList.add('show');
    if (pill) pill.classList.add('open');
  }
}

function closeAccountDropdown() {
  const dropdown = document.getElementById('accountDropdown');
  const pill = document.getElementById('userPill');
  if (dropdown) dropdown.classList.remove('show');
  if (pill) pill.classList.remove('open');
}

// Close account dropdown on outside click
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('userPillWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeAccountDropdown();
  }
});

function openAccountModal() {
  closeAccountDropdown();
  const modal = document.getElementById('accountModal');
  if (!modal) return;

  const name = (currentUser && currentUser.name) ? currentUser.name : 'Saif Khan';
  const isPhone = name.startsWith('+') || /^\d+$/.test(name.replace(/\D/g, ''));
  const initial = (!isPhone && name.charAt(0).match(/[a-zA-Z]/)) ? name.charAt(0).toUpperCase() : null;
  const phone = (currentUser && currentUser.phone) ? currentUser.phone : '+91 96119 57661';

  const modalAvatar = document.getElementById('accModalAvatar');
  if (modalAvatar) {
    modalAvatar.innerHTML = initial ? initial : '<svg viewBox="0 0 24 24" width="38" height="38" stroke="var(--gold-border)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
  }
  document.getElementById('accModalName').innerText = name;
  document.getElementById('accModalPhone').innerText = phone;

  // Count shortlisted profiles
  const interestBtns = document.querySelectorAll('.btn-interest.active');
  const countSpan = document.getElementById('statShortlisted');
  if (countSpan) countSpan.innerText = interestBtns.length;

  modal.classList.add('open');
}

function closeAccountModal() {
  const modal = document.getElementById('accountModal');
  if (modal) modal.classList.remove('open');
}

function logoutUser() {
  if (confirm("Are you sure you want to log out of Banarsi Joda?")) {
    if (isFirebaseReady && auth) {
      try { auth.signOut(); } catch(e) {}
    }
    currentUser = null;
    closeAccountModal();
    closeAccountDropdown();

    // Toggle Header Buttons
    document.getElementById('btnLogin').style.display = 'inline-block';
    document.getElementById('btnReg').style.display = 'inline-block';
    document.getElementById('userPillWrap').style.display = 'none';

    // Restore Confidential Guest Gate
    document.getElementById('guestGate').style.display = 'block';
    document.getElementById('filterBar').style.display = 'none';
    document.getElementById('cardsList').style.display = 'none';

    alert('You have been logged out successfully. Profiles are now protected under guest pardah.');
  }
}

// ==========================================
// APPLE-STYLE SHARE SHEET LOGIC
// ==========================================
let currentShareData = { name: '', text: '', url: '' };

function handleShare(encodedName, age, mohalla) {
  const name = decodeURIComponent(encodedName);
  const shareText = `Salam, check out the matrimonial profile of ${name} (${age}, ${mohalla}) on Banarsi Joda:`;
  const shareUrl = window.location.href;
  currentShareData = { name: name, text: shareText, url: shareUrl };

  if (navigator.share) {
    navigator.share({
      title: 'Banarsi Joda - ' + name,
      text: shareText,
      url: shareUrl
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        openShareModal(name, shareText, shareUrl);
      }
    });
  } else {
    openShareModal(name, shareText, shareUrl);
  }
}

function openShareModal(name, text, url) {
  const modal = document.getElementById('shareModal');
  if (!modal) return;
  const target = document.getElementById('shareProfileTarget');
  if (target) target.innerText = 'Share ' + name + "'s profile with family";

  const waUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text + ' ' + url);
  const waLink = document.getElementById('shareWaLink');
  if (waLink) waLink.href = waUrl;

  const mailUrl = 'mailto:?subject=' + encodeURIComponent('Banarsi Joda Profile: ' + name) + '&body=' + encodeURIComponent(text + '\n\n' + url);
  const mailLink = document.getElementById('shareMailLink');
  if (mailLink) mailLink.href = mailUrl;

  const smsUrl = 'sms:?body=' + encodeURIComponent(text + ' ' + url);
  const smsLink = document.getElementById('shareSmsLink');
  if (smsLink) smsLink.href = smsUrl;

  const copySpan = document.getElementById('copyLinkText');
  if (copySpan) copySpan.innerText = 'Copy Link';

  modal.classList.add('open');
}

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) modal.classList.remove('open');
}

function copyProfileLink() {
  const link = currentShareData.url || window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => {
      const copySpan = document.getElementById('copyLinkText');
      if (copySpan) copySpan.innerText = '✓ Copied!';
      setTimeout(() => {
        if (copySpan) copySpan.innerText = 'Copy Link';
        closeShareModal();
      }, 1000);
    });
  } else {
    alert('Profile Link: ' + link);
  }
}

// ==========================================
// IN-WEBSITE TRADE CHAT LOGIC
// ==========================================
let activeChatFirm = '';
let activeChatOwner = '';

function openInWebChat(encodedFirm, encodedOwner) {
  activeChatFirm = decodeURIComponent(encodedFirm);
  activeChatOwner = decodeURIComponent(encodedOwner);

  const modal = document.getElementById('inWebChatModal');
  if (!modal) return;

  document.getElementById('chatFirmName').innerText = activeChatFirm;
  document.getElementById('chatOwnerName').innerText = activeChatOwner;

  const messagesArea = document.getElementById('chatMessagesArea');
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Load Initial Welcome Message from Manufacturer
  messagesArea.innerHTML = `
    <div class="chat-system-badge">Direct Community Trade Messenger</div>
    <div class="chat-msg-bubble chat-msg-incoming">
      <div>Assalamu Alaikum! Janab <b>${activeChatOwner}</b> here from <b>${activeChatFirm}</b>. Welcome to our Banaras handloom unit. How can we assist you with wholesale saree orders, catalog pricing, or custom brocade weaving today?</div>
      <div class="chat-msg-time">${timeStr}</div>
    </div>
  `;

  modal.classList.add('open');
  const input = document.getElementById('chatInputBox');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 150);
  }
}

function closeInWebChat() {
  const modal = document.getElementById('inWebChatModal');
  if (modal) modal.classList.remove('open');
}

function submitChatMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chatInputBox');
  if (!input) return;
  const msgText = input.value.trim();
  if (!msgText) return;

  const messagesArea = document.getElementById('chatMessagesArea');
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Append User Outgoing Message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-msg-bubble chat-msg-outgoing';
  userBubble.innerHTML = `<div>${escapeHtml(msgText)}</div><div class="chat-msg-time">${timeStr}</div>`;
  messagesArea.appendChild(userBubble);
  input.value = '';
  messagesArea.scrollTop = messagesArea.scrollHeight;

  // 2. Simulated Realistic Instant Response from Weaver
  setTimeout(() => {
    const weaverBubble = document.createElement('div');
    weaverBubble.className = 'chat-msg-bubble chat-msg-incoming';
    const respTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let weaverReply = `Jazakallah Khair for reaching out! We have received your inquiry. We have our wholesale catalog and sample swatches ready to ship. We will follow up directly on your verified member contact.`;
    if (msgText.toLowerCase().includes('catalog') || msgText.toLowerCase().includes('price')) {
      weaverReply = `Sure! Our wholesale catalog with pure Katan silk and Kadwa brocade price list is being sent. Sample sets can be dispatched to your city within 24 hours.`;
    } else if (msgText.toLowerCase().includes('moq')) {
      weaverReply = `Our minimum order quantity is flexible for verified boutique owners (starting from 10 pieces). Mix-and-match designs are available.`;
    }

    weaverBubble.innerHTML = `<div>${weaverReply}</div><div class="chat-msg-time">${respTime}</div>`;
    messagesArea.appendChild(weaverBubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }, 750);
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('chatInputBox');
  if (input) {
    input.value = promptText;
    submitChatMessage();
  }
}

function escapeHtml(string) {
  const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}


// ==========================================
// MODERN SHAADI.COM REGISTRATION LOGIC
// ==========================================
function selectChip(element, targetInputId, value) {
  const parent = element.parentElement;
  parent.querySelectorAll('.reg-chip').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
  const target = document.getElementById(targetInputId);
  if (target) target.value = value;
}

function selectGender(element, gender) {
  selectChip(element, 'inGender', gender);
  genderChanged();
}

function toggleMultiChip(element) {
  element.classList.toggle('active');
  const activeChips = Array.from(document.querySelectorAll('#hobbiesChips .reg-chip.active')).map(c => c.innerText.replace('✓', '').trim());
  const input = document.getElementById('inHobbies');
  if (input) input.value = activeChips.join(', ');
}

function toggleIncomeView(type) {
  const btnYearly = document.getElementById('btnIncYearly');
  const btnMonthly = document.getElementById('btnIncMonthly');
  if (btnYearly) btnYearly.classList.toggle('active', type === 'yearly');
  if (btnMonthly) btnMonthly.classList.toggle('active', type === 'monthly');
}

function showRegStep(step) {
  if (step === 7) genderChanged();
  for (let i = 1; i <= 7; i++) {
    const box = document.getElementById('regStep' + i);
    const prog = document.getElementById('prog' + i);
    if (box) box.style.display = (i === step) ? 'block' : 'none';
    if (prog) prog.classList.toggle('active', i <= step);
  }
}

function proceedRegStep(cur, nxt) {
  if (cur === 1) {
    const n = document.getElementById('inName').value.trim();
    const a = document.getElementById('inAge').value.trim();
    if (!n || !a) return alert('Please enter the candidate name and age to continue.');
  } else if (cur === 2) {
    const w = document.getElementById('inWalid').value.trim();
    const d = document.getElementById('inDada').value.trim();
    const k = document.getElementById('inKhandaan').value.trim();
    const m = document.getElementById('inMohalla').value;
    const c = document.getElementById('inCity').value.trim();
    if (!w || !d || !k || !m || !c) return alert('Please enter lineage details (Walid, Dada, Khandaan, Mohalla, City).');
  } else if (cur === 3) {
    const h = document.getElementById('inHeight').value;
    const wt = document.getElementById('inWeight').value;
    if (!h || !wt) return alert('Please select height and weight.');
  } else if (cur === 6) {
    // Proceed from Hobbies to Photo Upload
  }
  showRegStep(nxt);
}

function professionChanged() {
  const sel = document.getElementById('inWork');
  const customWrap = document.getElementById('customWorkWrap');
  if (sel && customWrap) {
    customWrap.style.display = (sel.value === 'Other') ? 'block' : 'none';
    if (sel.value === 'Other') {
      const customInput = document.getElementById('inWorkCustom');
      if (customInput) customInput.focus();
    }
  }
}

// ==========================================
// PROFILE COMPLETION PERCENTAGE & PROGRESS RING LOGIC
// ==========================================
function getProfileCompletionScore(p) {
  if (!p) return 25;
  let score = 0;
  // Step 1: Basic Identity (20%)
  if (p.fullName && p.age) score += 15;
  if (p.gender) score += 5;
  
  // Step 2: Lineage & Banaras Roots (25%)
  if (p.walidName && p.dadaName) score += 10;
  if (p.khandaan) score += 5;
  if (p.mohalla) score += 5;
  if (p.city) score += 5;

  // Step 3: Personal & Lifestyle (15%)
  if (p.maritalStatus) score += 5;
  if (p.height && p.weight) score += 5;
  if (p.diet) score += 5;

  // Step 4: Career & Income (15%)
  if (p.profession) score += 10;
  if (p.income) score += 5;

  // Step 5: Family Details (15%)
  if (p.fatherStatus && p.motherStatus) score += 10;
  if (p.familyFinance) score += 5;

  // Step 6 & 7: Photo/Pardah & Verification Contact (10%)
  if (p.phone) score += 5;
  if (p.photo || p.gender === 'Female') score += 5; // Sisters get full score for Pardah

  return Math.min(100, Math.max(25, score));
}

function updateProfileProgressUI(score, isVerified) {
  const percent = score || 25;
  
  // 1. Update SVG Progress Ring
  // Circumference = 2 * PI * 15 ≈ 94.25
  const circle = document.getElementById('profileProgressCircle');
  if (circle) {
    const circumference = 94.25;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    // Turn emerald green when 100%, gold when in progress
    circle.style.stroke = (percent >= 100) ? '#10b981' : 'var(--gold-accent)';
  }

  // 2. Update Progress Wrap Tooltip & Pill
  const wrap = document.getElementById('userProgressWrap');
  if (wrap) wrap.title = `Profile ${percent}% Complete`;

  const pill = document.getElementById('pillCompletion');
  if (pill) {
    pill.innerText = `${percent}%`;
    pill.classList.toggle('complete', percent >= 100);
  }

  // 3. Update Verification Reminder Card in Dropdown Menu
  const reminderCard = document.getElementById('verifyReminderCard');
  const titleEl = document.getElementById('verifyStatusTitle');
  const subEl = document.getElementById('verifyStatusSub');
  const fillEl = document.getElementById('verifyProgressFill');
  const shieldBox = document.getElementById('verifyShieldBox');

  if (fillEl) fillEl.style.width = `${percent}%`;
  if (titleEl) titleEl.innerText = (percent >= 100) ? 'Profile 100% Complete' : `Profile ${percent}% Complete`;

  if (percent >= 100) {
    if (subEl) subEl.innerHTML = 'Mubarak! Your profile is verified with the green <b>Community Verified Seal</b>.';
    if (shieldBox) shieldBox.innerText = '✅';
    if (reminderCard) reminderCard.style.borderColor = '#a7f3d0';
  } else {
    if (subEl) subEl.innerHTML = 'Complete family & lineage details to unlock your green <b>Community Verified Badge</b>.';
    if (shieldBox) shieldBox.innerText = '🛡️';
    if (reminderCard) reminderCard.style.borderColor = 'var(--gold-border)';
  }

  // 4. Update Top Floating Banner
  const banner = document.getElementById('verifyFloatingBanner');
  if (banner) {
    const isDismissed = sessionStorage.getItem('banarsi_verify_banner_dismissed');
    if (percent < 100 && !isDismissed && currentUser) {
      banner.style.display = 'block';
    } else {
      banner.style.display = 'none';
    }
  }

  // 5. Update Dropdown Status Row
  const dropStatusText = document.getElementById('dropdownStatusText');
  if (dropStatusText) {
    dropStatusText.innerText = (percent >= 100) ? 'Verified Member' : 'Verification Pending';
  }
}

function dismissVerifyBanner() {
  const banner = document.getElementById('verifyFloatingBanner');
  if (banner) banner.style.display = 'none';
  sessionStorage.setItem('banarsi_verify_banner_dismissed', 'true');
}
