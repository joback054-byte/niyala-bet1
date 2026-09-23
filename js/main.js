alert('main.js loaded!');
// የኒያላ ቢት - ዋና ስክሪፕት

// ጨዋታዎችን ማሳየት
function renderMatches(filter = 'all') {
  const grid = document.getElementById('matchesGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? matchesData
    : matchesData.filter(m => m.sport === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-matches">ምንም ጨዋታ አልተገኘም</p>';
    return;
  }

  grid.innerHTML = filtered.map(match => `
    <div class="match-card">
      <div class="match-header">
        <span class="match-league">${match.sportIcon} ${match.league}</span>
        <span class="match-time">${match.date} • ${match.time}</span>
      </div>
      <div class="match-teams">
        <div class="team home">${match.home}</div>
        <div class="vs-badge">VS</div>
        <div class="team away">${match.away}</div>
      </div>
      <div class="odds-row">
        <button class="odd-btn" data-match="${match.id}" data-pick="home" onclick="placeBet(${match.id}, 'home')">
          <span class="odd-label">1</span>
          <span class="odd-value">${match.odds.home}</span>
        </button>
        ${match.odds.draw ? `
          <button class="odd-btn" data-match="${match.id}" data-pick="draw" onclick="placeBet(${match.id}, 'draw')">
            <span class="odd-label">X</span>
            <span class="odd-value">${match.odds.draw}</span>
          </button>
        ` : ''}
        <button class="odd-btn" data-match="${match.id}" data-pick="away" onclick="placeBet(${match.id}, 'away')">
          <span class="odd-label">2</span>
          <span class="odd-value">${match.odds.away}</span>
        </button>
      </div>
    </div>
  `).join('');
}

// ውድድር መቀመጥ (በኋላ እናሻሽለዋለን)
function placeBet(matchId, pick) {
  const match = matchesData.find(m => m.id === matchId);
  const pickLabel = pick === 'home' ? match.home
                  : pick === 'away' ? match.away
                  : 'እኩል';

  alert(
    `✅ ምርጫህ ተመዝግቧል!\n\n` +
    `ጨዋታ: ${match.home} vs ${match.away}\n` +
    `ምርጫ: ${pickLabel}\n` +
    `ኮፊሸንት: ${match.odds[pick]}`
  );
}

// የማጣሪያ አዝራሮች
document.addEventListener('DOMContentLoaded', () => {
  renderMatches();
  setupFilters();
  updateBalanceUI();
  setupModal();
  setupBetSlip();        // ← አዲስ

  const depositBtn = document.querySelector('.btn-deposit');
  if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
  }
});

// ገጹ ሲጫን
document.addEventListener('DOMContentLoaded', () => {
  renderMatches();
  setupFilters();
});
// ===== የቀሪ ሂሳብ ስርዓት =====
const balanceState = {
  balance: 0,
  won: 0,
  deposit: 0
};

// የቀሪ ሂሳብ ማሳያ
function updateBalanceUI() {
  const balanceEl = document.getElementById('balanceAmount');
  const wonEl = document.getElementById('wonAmount');
  const depositEl = document.getElementById('depositAmount');

  if (balanceEl) balanceEl.textContent = balanceState.balance.toFixed(2) + ' ETB';
  if (wonEl) wonEl.textContent = balanceState.won.toFixed(2) + ' ETB';
  if (depositEl) depositEl.textContent = balanceState.deposit.toFixed(2) + ' ETB';
}

// ተቀማጭ ማድረግ (ጊዜያዊ)
function handleDeposit() {
  const amount = prompt('💰 ስንት ብር ማስገባት ትፈልጋለህ?', '100');
  if (amount === null) return;

  const value = parseFloat(amount);
  if (isNaN(value) || value <= 0) {
    alert('❌ እባክህ ትክክለኛ መጠን አስገባ');
    return;
  }

  balanceState.deposit += value;
  balanceState.balance += value;
  updateBalanceUI();
  alert(`✅ ${value.toFixed(2)} ETB በተሳካ ሁኔታ ገብቷል!`);
}

// ገጹ ሲጫን — ቀሪ ሂሳብ አሳይ
document.addEventListener('DOMContentLoaded', () => {
  updateBalanceUI();

  const depositBtn = document.querySelector('.btn-deposit');
  if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
  }
});
// ===== የመግቢያ/የመመዝገቢያ ሞዳል =====
let authMode = 'login'; // 'login' ወይም 'register'

const modalEl = document.getElementById('authModal');

// ሞዳል መክፈት
function openAuthModal(mode) {
  authMode = mode;
  updateModalUI();
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden'; // ጀርባ እንዳይሸብል
}

// ሞዳል መዝጋት
function closeAuthModal() {
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
  clearForm();
}

// የሞዳል ገጽታ ማዘመን
function updateModalUI() {
  const title = document.getElementById('modalTitle');
  const subtitle = document.getElementById('modalSubtitle');
  const emailGroup = document.getElementById('emailGroup');
  const confirmGroup = document.getElementById('confirmGroup');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const switchText = document.getElementById('switchText');
  const switchLink = document.getElementById('switchLink');

  if (authMode === 'login') {
    title.textContent = 'ግባ';
    subtitle.textContent = 'ወደ ኒያላ ቢት እንኳን ደህና መጣህ!';
    emailGroup.style.display = 'none';
    confirmGroup.style.display = 'none';
    submitBtn.textContent = 'ግባ';
    switchText.textContent = 'አካውንት የለህም?';
    switchLink.textContent = 'ተመዝገብ';
  } else {
    title.textContent = 'ተመዝገብ';
    subtitle.textContent = 'አዲስ አካውንት ፍጠርና ተጫወት!';
    emailGroup.style.display = 'block';
    confirmGroup.style.display = 'block';
    submitBtn.textContent = 'ተመዝገብ';
    switchText.textContent = 'አካውንት አለህ?';
    switchLink.textContent = 'ግባ';
  }
}

// ፎርም ማጽዳት
function clearForm() {
  document.getElementById('inputUsername').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputPassword').value = '';
  document.getElementById('inputConfirm').value = '';
}

// ፎርም ማስገባት
function handleAuthSubmit() {
  const username = document.getElementById('inputUsername').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const password = document.getElementById('inputPassword').value;
  const confirm = document.getElementById('inputConfirm').value;

  // ማረጋገጫ
  if (!username) {
    alert('❌ እባክህ የተጠቃሚ ስም አስገባ');
    return;
  }
  if (!password || password.length < 4) {
    alert('❌ የይለፍ ቃል ቢያንስ 4 ፊደል መሆን አለበት');
    return;
  }

  if (authMode === 'register') {
    if (!email || !email.includes('@')) {
      alert('❌ ትክክለኛ ኢሜይል አስገባ');
      return;
    }
    if (password !== confirm) {
      alert('❌ የይለፍ ቃላቱ አይመሳሰሉም');
      return;
    }

    // ተጠቃሚ ማስቀመጥ (localStorage — ጊዜያዊ)
    const user = { username, email, balance: 0 };
    localStorage.setItem('niyala_user', JSON.stringify(user));

    alert(`✅ እንኳን ደህና መጣህ ${username}!`);
    closeAuthModal();
    updateUserUI(user);
  } else {
    // የመግቢያ ማረጋገጫ
    const stored = localStorage.getItem('niyala_user');
    if (!stored) {
      alert('❌ አካውንት አልተገኘም። እባክህ መጀመሪያ ተመዝገብ');
      return;
    }
    const user = JSON.parse(stored);
    if (user.username !== username) {
      alert('❌ የተጠቃሚ ስም አልተገኘም');
      return;
    }

    alert(`✅ እንኳን ደህና መጣህ ${username}!`);
    closeAuthModal();
    updateUserUI(user);
  }
}

// የተጠቃሚ UI ማዘመን
function updateUserUI(user) {
  const loginBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');
  if (loginBtn && registerBtn) {
    loginBtn.textContent = `👤 ${user.username}`;
    loginBtn.onclick = openProfile;    // ← ተቀይሯል
    registerBtn.style.display = 'none';
  }
}

// የሞዳል ክፍሎችን ማዘጋጀት
function setupModal() {
  const loginBtn = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');
  const modalEl = document.getElementById('authModal');
  const modalClose = document.getElementById('modalClose');
  const switchLink = document.getElementById('switchLink');
  const authForm = document.getElementById('authForm');

  if (loginBtn) {
    loginBtn.onclick = () => openAuthModal('login');
  }

  if (registerBtn) {
    registerBtn.onclick = () => openAuthModal('register');
  }

  if (modalClose) {
    modalClose.onclick = closeAuthModal;
  }

  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeAuthModal();
    });
  }

  if (switchLink) {
    switchLink.onclick = (e) => {
      e.preventDefault();
      authMode = authMode === 'login' ? 'register' : 'login';
      updateModalUI();
    };
  }

  if (authForm) {
    authForm.onsubmit = handleAuthSubmit;
  }

  const stored = localStorage.getItem('niyala_user');
  if (stored) {
    try {
      updateUserUI(JSON.parse(stored));
    } catch (e) {}
  }
}

// ===== ሁሉንም ማስጀመሪያ =====
document.addEventListener('DOMContentLoaded', () => {
  renderMatches();
  setupFilters();
  updateBalanceUI();
  setupModal();

  const depositBtn = document.querySelector('.btn-deposit');
  if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
  }
});
// ===== BET SLIP ስርዓት =====
let betSlipItems = [];

function addToBetSlip(matchId, pick) {
  betSlipItems = betSlipItems.filter(item => item.matchId !== matchId);

  const match = matchesData.find(m => m.id === matchId);
  if (!match) return;

  betSlipItems.push({
    matchId: matchId,
    home: match.home,
    away: match.away,
    league: match.league,
    pick: pick,
    pickLabel: pick === 'home' ? match.home : pick === 'away' ? match.away : 'እኩል',
    odds: match.odds[pick]
  });

  renderBetSlip();
  updateOddButtons();
}

function removeFromBetSlip(matchId) {
  betSlipItems = betSlipItems.filter(item => item.matchId !== matchId);
  renderBetSlip();
  updateOddButtons();
}

function renderBetSlip() {
  const body = document.getElementById('betSlipBody');
  const count = document.getElementById('betSlipCount');
  const totalOdds = document.getElementById('betSlipTotalOdds');
  const potential = document.getElementById('betSlipPotential');
  const stakeEl = document.getElementById('betStake');
  const stake = stakeEl ? parseFloat(stakeEl.value) || 0 : 0;

  if (!body) return;
  if (count) count.textContent = betSlipItems.length;

  if (betSlipItems.length === 0) {
    body.innerHTML = '<p class="bet-slip-empty">ምንም ጨዋታ አልመረጥክም</p>';
    if (totalOdds) totalOdds.textContent = '0.00';
    if (potential) potential.textContent = '0.00 ETB';
    return;
  }

  body.innerHTML = betSlipItems.map(item => `
    <div class="bet-item">
      <button class="bet-item-remove" onclick="removeFromBetSlip(${item.matchId})">✕</button>
      <div class="bet-item-header">${item.league}</div>
      <div class="bet-item-teams">${item.home} vs ${item.away}</div>
      <div class="bet-item-pick">
        <span>ምርጫ: <strong>${item.pickLabel}</strong></span>
        <strong>${item.odds.toFixed(2)}</strong>
      </div>
    </div>
  `).join('');

  const total = betSlipItems.reduce((acc, item) => acc * item.odds, 1);
  if (totalOdds) totalOdds.textContent = total.toFixed(2);
  if (potential) potential.textContent = (total * stake).toFixed(2) + ' ETB';
}

function updateOddButtons() {
  document.querySelectorAll('.odd-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  betSlipItems.forEach(item => {
    const sel = `.odd-btn[data-match="${item.matchId}"][data-pick="${item.pick}"]`;
    const btn = document.querySelector(sel);
    if (btn) btn.classList.add('selected');
  });
}

function toggleBetSlip() {
  const slip = document.getElementById('betSlip');
  if (slip) slip.classList.toggle('open');
}

function placeFullBet() {
  if (betSlipItems.length === 0) {
    alert('❌ እባክህ መጀመሪያ ጨዋታ ምረጥ');
    return;
  }

  const stake = parseFloat(document.getElementById('betStake').value);
  if (!stake || stake <= 0) {
    alert('❌ እባክህ የውድድር መጠን አስገባ');
    return;
  }

  if (stake > balanceState.balance) {
    alert('❌ ቀሪ ሂሳብህ አይበቃም። ያለህ: ' + balanceState.balance.toFixed(2) + ' ETB');
    return;
  }

  const totalOdds = betSlipItems.reduce((acc, item) => acc * item.odds, 1);
  const potentialWin = totalOdds * stake;

  // ወደ ታሪክ ጨምር
const now = new Date();
const dateStr = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
betHistory.push({
  date: dateStr,
  stake: stake,
  totalOdds: totalOdds,
  potentialWin: potentialWin,
  status: 'pending',
  items: betSlipItems.map(i => ({
    home: i.home,
    away: i.away,
    pick: i.pickLabel,
    odds: i.odds
  }))
});
saveBetHistory();
  balanceState.balance -= stake;
  updateBalanceUI();

  alert(
    '✅ ውድድር ተቀምጧል!\n\n' +
    'የውድድር መጠን: ' + stake.toFixed(2) + ' ETB\n' +
    'ጠቅላላ ኮፊሸንት: ' + totalOdds.toFixed(2) + '\n' +
    'ተገመተ ትርፍ: ' + potentialWin.toFixed(2) + ' ETB'
  );

  betSlipItems = [];
  document.getElementById('betStake').value = '';
  renderBetSlip();
  updateOddButtons();
  toggleBetSlip();
  scheduleAutoResolve();
}

function placeBet(matchId, pick) {
  addToBetSlip(matchId, pick);
  const slip = document.getElementById('betSlip');
  if (slip && !slip.classList.contains('open') && betSlipItems.length === 1) {
    slip.classList.add('open');
  }
}
// ===== የካሲኖ ስርዓት =====
function renderCasino(filter = 'all') {
  const grid = document.getElementById('casinoGrid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? casinoData
    : casinoData.filter(g => g.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-matches">ምንም ጨዋታ አልተገኘም</p>';
    return;
  }

  grid.innerHTML = filtered.map(game => `
    <div class="casino-card" onclick="openCasinoGame(${game.id})">
      <span class="casino-icon">${game.icon}</span>
      <div class="casino-name">${game.name}</div>
      <div class="casino-provider">${game.provider}</div>
      <div class="casino-players">👥 ${game.players} ተጫዋቾች</div>
    </div>
  `).join('');
}

function openCasinoGame(gameId) {
  const game = casinoData.find(g => g.id === gameId);
  if (!game) return;

  // የተጠቃሚ ማረጋገጫ
  const stored = localStorage.getItem('niyala_user');
  if (!stored) {
    alert('❌ እባክህ መጀመሪያ ግባ');
    openAuthModal('login');
    return;
  }

  alert(
    `${game.icon} ${game.name}\n\n` +
    `አቅራቢ: ${game.provider}\n` +
    `ተጫዋቾች: ${game.players}\n\n` +
    `🎮 ጨዋታ ለመጀመር ተዘጋጅቷል!`
  );
}

function setupCasinoFilters() {
  const filters = document.querySelectorAll('.casino-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCasino(btn.dataset.category);
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  renderMatches();
  setupFilters();
  updateBalanceUI();
  setupModal();
  setupBetSlip();
  renderCasino();          // ← አዲስ
  setupCasinoFilters();    // ← አዲስ

  const depositBtn = document.querySelector('.btn-deposit');
  if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
  }
});
// ===== የተጠቃሚ መገለጫ =====
let betHistory = [];

// የታሪክ መጫኛ
function loadBetHistory() {
  const stored = localStorage.getItem('niyala_bets');
  if (stored) {
    try {
      betHistory = JSON.parse(stored);
    } catch (e) {
      betHistory = [];
    }
  }
}

// የታሪክ ማስቀመጫ
function saveBetHistory() {
  localStorage.setItem('niyala_bets', JSON.stringify(betHistory));
}

// መገለጫ መክፈት
function openProfile() {
  const stored = localStorage.getItem('niyala_user');
  if (!stored) {
    openAuthModal('login');
    return;
  }

  const user = JSON.parse(stored);
  document.getElementById('profileName').textContent = user.username;
  document.getElementById('profileEmail').textContent = user.email || 'no-email';
  document.getElementById('profileAvatar').textContent = user.username.charAt(0).toUpperCase();
  document.getElementById('profileBalance').textContent = balanceState.balance.toFixed(2);
  document.getElementById('profileBets').textContent = betHistory.length;
  document.getElementById('profileWon').textContent = balanceState.won.toFixed(2);

  renderBetHistory();
  document.getElementById('profileModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// መገለጫ መዝጋት
function closeProfile() {
  document.getElementById('profileModal').classList.remove('active');
  document.body.style.overflow = '';
}

// የታሪክ ማሳያ
function renderBetHistory() {
  const container = document.getElementById('betHistory');
  if (!container) return;

  if (betHistory.length === 0) {
    container.innerHTML = '<p class="no-matches">ምንም ውድድር የለም</p>';
    return;
  }

  container.innerHTML = betHistory.slice().reverse().map(bet => {
    const isWithdraw = bet.type === 'withdraw';

    const statusClass = bet.status === 'won' ? 'won'
                      : bet.status === 'lost' ? 'lost'
                      : bet.status === 'withdrawn' ? 'withdrawn'
                      : 'pending';

    const statusLabel = bet.status === 'won' ? '✅ አሸንፈሃል'
                      : bet.status === 'lost' ? '❌ ተሸንፈሃል'
                      : bet.status === 'withdrawn' ? '💸 ወጥቷል'
                      : '⏳ በመጠባበቅ';

    if (isWithdraw) {
      return `
        <div class="history-item">
          <div class="history-item-top">
            <span>${bet.date}</span>
            <span class="history-status ${statusClass}">${statusLabel}</span>
          </div>
          <div class="history-item-teams">💸 ወደ ${bet.method}</div>
          <div class="history-item-info">
            <span>ሂሳብ: <strong>${bet.account}</strong></span>
            <span>መጠን: <strong>${bet.stake.toFixed(2)} ETB</strong></span>
          </div>
        </div>
      `;
    }

    const teamsList = bet.items.map(i => `${i.home} vs ${i.away}`).join('<br>');

    return `
      <div class="history-item">
        <div class="history-item-top">
          <span>${bet.date}</span>
          <span class="history-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="history-item-teams">${teamsList}</div>
        <div class="history-item-info">
          <span>መጠን: <strong>${bet.stake.toFixed(2)} ETB</strong></span>
          <span>ኮፊሸንት: <strong>${bet.totalOdds.toFixed(2)}</strong></span>
        </div>
      </div>
    `;
  }).join('');
}

// መውጣት
function logoutUser() {
  if (!confirm('መውጣት ትፈልጋለህ?')) return;

  localStorage.removeItem('niyala_user');
  closeProfile();
  location.reload();
}

// የመገለጫ ክፍሎችን ማዘጋጀት
function setupProfile() {
  const close = document.getElementById('profileClose');
  const modal = document.getElementById('profileModal');
  const logout = document.getElementById('btnLogout');
  const resolveBtn = document.getElementById('btnResolveBets');

  if (close) close.onclick = closeProfile;
  if (logout) logout.onclick = logoutUser;
  if (resolveBtn) resolveBtn.onclick = resolveAllPendingBets;

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProfile();
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  setupProfile();
  loadBetHistory();
});
// ===== የውድድር ውጤት ማስመሰል =====

// አንድ ውድድር ውጤት ማስመሰል
function resolveBet(betIndex) {
  const bet = betHistory[betIndex];
  if (!bet || bet.status !== 'pending') return false;

  // 60% የማሸነፍ ዕድል
  const isWin = Math.random() < 0.6;

  if (isWin) {
    bet.status = 'won';
    balanceState.balance += bet.potentialWin;
    balanceState.won += bet.potentialWin - bet.stake;
  } else {
    bet.status = 'lost';
  }

  saveBetHistory();
  updateBalanceUI();
  return isWin;
}

// ሁሉንም በመጠባበቅ ያሉ ውድድሮችን መፍታት
function resolveAllPendingBets() {
  const pendingCount = betHistory.filter(b => b.status === 'pending').length;

  if (pendingCount === 0) {
    alert('ℹ️ ምንም በመጠባበቅ ያለ ውድድር የለም');
    return;
  }

  let wonCount = 0;
  let lostCount = 0;

  betHistory.forEach((bet, index) => {
    if (bet.status === 'pending') {
      const won = resolveBet(index);
      if (won) wonCount++;
      else lostCount++;
    }
  });

  alert(
    `🎲 ውጤቶች ተጠናቀቁ!\n\n` +
    `✅ ያሸነፍከው: ${wonCount}\n` +
    `❌ የተሸነፍከው: ${lostCount}`
  );

  // መገለጫ ክፍት ከሆነ አዘምን
  const profileModal = document.getElementById('profileModal');
  if (profileModal && profileModal.classList.contains('active')) {
    openProfile();
  }
}

// በራስ-ሰር ውጤት ማስመሰል (10 ሰከንድ በኋላ)
function scheduleAutoResolve() {
  const pending = betHistory.filter(b => b.status === 'pending').length;
  if (pending === 0) return;

  setTimeout(() => {
    const stillPending = betHistory.some(b => b.status === 'pending');
    if (!stillPending) return;

    betHistory.forEach((bet, index) => {
      if (bet.status === 'pending') {
        resolveBet(index);
      }
    });

    // ማሳወቂያ
    showToast('🎲 የውድድር ውጤቶች ተጠናቀቁ!');
  }, 10000);
}
// ===== Toast ማሳወቂያ =====
function showToast(message, type = 'info') {
  // አሮጌ ካለ አስወግድ
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
// ===== የገንዘብ ማውጣት ስርዓት =====

// የማውጣት ሞዳል መክፈት
function openWithdrawModal() {
  const stored = localStorage.getItem('niyala_user');
  if (!stored) {
    openAuthModal('login');
    return;
  }

  document.getElementById('withdrawBalance').textContent = balanceState.balance.toFixed(2) + ' ETB';
  document.getElementById('withdrawAccount').value = '';
  document.getElementById('withdrawAmount').value = '';

  document.getElementById('withdrawModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ሞዳል መዝጋት
function closeWithdrawModal() {
  document.getElementById('withdrawModal').classList.remove('active');
  document.body.style.overflow = '';
}

// የማውጣት ማረጋገጫ
function confirmWithdraw() {
  const method = document.querySelector('input[name="withdrawMethod"]:checked').value;
  const account = document.getElementById('withdrawAccount').value.trim();
  const amount = parseFloat(document.getElementById('withdrawAmount').value);

  // ማረጋገጫ
  if (!account) {
    alert('❌ እባክህ የሂሳብ ቁጥር አስገባ');
    return;
  }

  if (!amount || amount < 50) {
    alert('❌ ዝቅተኛ የማውጣት መጠን 50 ETB ነው');
    return;
  }

  if (amount > balanceState.balance) {
    alert('❌ ቀሪ ሂሳብህ አይበቃም። ያለህ: ' + balanceState.balance.toFixed(2) + ' ETB');
    return;
  }

  const methodLabel = method === 'telebirr' ? 'Telebirr'
                    : method === 'cbe' ? 'Commercial Bank'
                    : 'Awash Bank';

  // ቀሪ ሂሳብ ቀንስ
  balanceState.balance -= amount;
  updateBalanceUI();

  // ወደ ታሪክ ጨምር
  const now = new Date();
  const dateStr = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
  betHistory.push({
    date: dateStr,
    stake: amount,
    totalOdds: 0,
    potentialWin: 0,
    status: 'withdrawn',
    type: 'withdraw',
    method: methodLabel,
    account: account,
    items: []
  });
  saveBetHistory();

  alert(
    '✅ የማውጣት ጥያቄ ተልኳል!\n\n' +
    'ዘዴ: ' + methodLabel + '\n' +
    'የሂሳብ ቁጥር: ' + account + '\n' +
    'መጠን: ' + amount.toFixed(2) + ' ETB\n\n' +
    'በ24 ሰዓት ውስጥ ይደርስዎታል።'
  );

  closeWithdrawModal();
}

// የማውጣት ክፍሎችን ማዘጋጀት
function setupWithdraw() {
  const btn = document.getElementById('btnWithdraw');
  const close = document.getElementById('withdrawClose');
  const confirm = document.getElementById('btnConfirmWithdraw');
  const modal = document.getElementById('withdrawModal');

  if (btn) btn.onclick = openWithdrawModal;
  if (close) close.onclick = closeWithdrawModal;
  if (confirm) confirm.onclick = confirmWithdraw;

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeWithdrawModal();
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  renderMatches();
  setupFilters();
  updateBalanceUI();
  setupModal();
  setupBetSlip();
  renderCasino();
  setupCasinoFilters();
  setupProfile();
  loadBetHistory();
  setupWithdraw();        // ← አዲስ

  const depositBtn = document.querySelector('.btn-deposit');
  if (depositBtn) {
    depositBtn.addEventListener('click', handleDeposit);
  }
});
