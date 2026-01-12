// ===============================
// SiTra-KIP FINAL STATE ENGINE
// ===============================

// === DEFAULT STATE (SATU-SATUNYA) ===
const defaultState = {
  loggedIn: false,

  status: "DALAM KOREKSI", // DALAM KOREKSI | DISETUJUI | DITOLAK
  keputusan: "MENUNGGU",   // MENUNGGU | DISETUJUI | DITOLAK

  audit: [
    "12 Jan 2026 - Konflik data terdeteksi"
  ],

  pencairan: {
    rekening: "BNI 1234567890 a.n. Muhammad Setio Budi",
    data: [
      {
        tahun: 2024,
        tahap: 1,
        tanggal: "12 Maret 2024",
        jumlah: "Rp 900.000",
        status: "CAIR"
      },
      {
        tahun: 2024,
        tahap: 2,
        tanggal: "15 September 2024",
        jumlah: "Rp 900.000",
        status: "CAIR"
      },
      {
        tahun: 2023,
        tahap: 1,
        tanggal: "10 April 2023",
        jumlah: "Rp 900.000",
        status: "CAIR"
      },
      {
        tahun: 2023,
        tahap: 2,
        tanggal: "18 Oktober 2023",
        jumlah: "Rp 900.000",
        status: "CAIR"
      }
    ]
  }
};

// ===============================
// LOAD STATE (PERSISTENT)
// ===============================
let state = JSON.parse(localStorage.getItem("sitra_state")) || defaultState;

// ===============================
// ELEMENTS
// ===============================
const loginBox = document.getElementById("login");
const dashboard = document.getElementById("dashboard");

const statusText = document.getElementById("statusText");
const statusDesc = document.getElementById("statusDesc");

const keputusanText = document.getElementById("keputusanText");
const keputusanDesc = document.getElementById("keputusanDesc");

const auditLog = document.getElementById("auditLog");

const rekeningInfo = document.getElementById("rekeningInfo");
const riwayatTable = document.getElementById("riwayatTable");

const btnAjukan = document.getElementById("btnAjukan");
const btnSetujui = document.getElementById("btnSetujui");
const btnTolak = document.getElementById("btnTolak");

// ===============================
// STATE UTIL
// ===============================
function saveState() {
  localStorage.setItem("sitra_state", JSON.stringify(state));
}

// ===============================
// LOGIN
// ===============================
function login() {
  state.loggedIn = true;
  saveState();
  showDashboard();
}

function showDashboard() {
  loginBox.style.display = "none";
  dashboard.classList.remove("hidden");
  render();
}

// ===============================
// RENDER (INTI SISTEM)
// ===============================
function render() {
  statusText.innerText = "STATUS: " + state.status;
  keputusanText.innerText = "Status: " + state.keputusan;

  // RESET
  btnAjukan.style.display = "none";
  btnSetujui.style.display = "none";
  btnTolak.style.display = "none";

  // STATUS LOGIC
  if (state.status === "DALAM KOREKSI") {
    statusDesc.innerText =
      "Perbaikan data telah diajukan dan menunggu verifikasi.";

    keputusanDesc.innerText =
      "Keputusan hanya dapat diambil oleh verifikator berwenang.";

    btnSetujui.style.display = "block";
    btnTolak.style.display = "block";
  }

  if (state.status === "DISETUJUI") {
    statusDesc.innerText =
      "Data telah diverifikasi dan dinyatakan valid. Proses pencairan dapat dilanjutkan.";

    keputusanDesc.innerText =
      "Keputusan final bersifat mengikat dan tidak dapat diubah.";
  }

  if (state.status === "DITOLAK") {
    statusDesc.innerText =
      "Permohonan ditolak. Alasan penolakan tercatat permanen.";

    keputusanDesc.innerText =
      "Penolakan bersifat final dan tidak dapat diajukan ulang.";
  }

  renderAudit();
  renderPencairan();
}

// ===============================
// AUDIT
// ===============================
function renderAudit() {
  auditLog.innerHTML = "";
  state.audit.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    auditLog.appendChild(li);
  });
}

// ===============================
// PENCAIRAN
// ===============================
function renderPencairan() {
  rekeningInfo.innerText =
    "Rekening Penyaluran: " + state.pencairan.rekening;

  riwayatTable.innerHTML = "";

  state.pencairan.data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.tahun}</td>
      <td>${item.tahap}</td>
      <td>${item.tanggal}</td>
      <td>${item.jumlah}</td>
      <td>${item.status}</td>
    `;
    riwayatTable.appendChild(tr);
  });
}

// ===============================
// KEPUTUSAN FINAL
// ===============================
function setDisetujui() {
  if (state.keputusan !== "MENUNGGU") return;

  state.status = "DISETUJUI";
  state.keputusan = "DISETUJUI";

  state.audit.push(
    new Date().toLocaleDateString("id-ID") +
    " - Disetujui oleh verifikator"
  );

  state.audit.push(
    "Catatan sistem: Pencairan dilakukan 2 tahap per tahun melalui rekening BNI"
  );

  saveState();
  render();
}

function setDitolak() {
  if (state.keputusan !== "MENUNGGU") return;

  state.status = "DITOLAK";
  state.keputusan = "DITOLAK";

  state.audit.push(
    new Date().toLocaleDateString("id-ID") +
    " - Ditolak oleh verifikator"
  );

  saveState();
  render();
}

// ===============================
// AUTO LOAD
// ===============================
window.onload = function () {
  if (state.loggedIn) {
    showDashboard();
  }
};