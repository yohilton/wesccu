/**
 * Western Chamber Co-operative Credit Union (WESCCU) Ltd.
 * Interactive Application & Calculator Logic
 */

// State variables for Loan Calculator
let currentLoanRate = 1.8; // default 1.8% per month
let currentLoanAmount = 15000;
let currentLoanMonths = 12;

// State variables for Savings Calculator
let currentDividendRate = 18.5; // default 18.5% p.a.
let currentMonthlySavings = 500;
let currentSavingsYears = 3;

document.addEventListener('DOMContentLoaded', () => {
  initLoanCalculator();
  initSavingsCalculator();
  initMobileNav();
});

// ================= LOAN CALCULATOR LOGIC =================
function initLoanCalculator() {
  const amountSlider = document.getElementById('loanAmountRange');
  const durationSlider = document.getElementById('loanDurationRange');

  if (amountSlider && durationSlider) {
    amountSlider.addEventListener('input', (e) => {
      currentLoanAmount = parseFloat(e.target.value);
      document.getElementById('loanAmountDisplay').textContent = formatCurrency(currentLoanAmount);
      calculateLoan();
    });

    durationSlider.addEventListener('input', (e) => {
      currentLoanMonths = parseInt(e.target.value, 10);
      document.getElementById('loanDurationDisplay').textContent = currentLoanMonths;
      calculateLoan();
    });

    calculateLoan();
  }
}

function selectLoanType(type, rateMonthly) {
  currentLoanRate = rateMonthly;
  
  const buttons = document.querySelectorAll('.loan-type-btn');
  buttons.forEach(btn => {
    btn.classList.remove('border-brand-navy', 'bg-brand-lightBlue/40', 'text-brand-navy', 'font-bold');
    btn.classList.add('border-slate-200', 'text-slate-700');
  });

  const eventTarget = event.currentTarget;
  if (eventTarget) {
    eventTarget.classList.remove('border-slate-200', 'text-slate-700');
    eventTarget.classList.add('border-brand-navy', 'bg-brand-lightBlue/40', 'text-brand-navy', 'font-bold');
  }

  calculateLoan();
}

function calculateLoan() {
  const principal = currentLoanAmount;
  const n = currentLoanMonths;
  const monthlyRate = currentLoanRate / 100;

  // Simple reducing / cooperative amortized installment estimation
  // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const compoundFactor = Math.pow(1 + monthlyRate, n);
  const monthlyRepayment = (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
  const totalPayable = monthlyRepayment * n;
  const totalInterest = totalPayable - principal;

  document.getElementById('monthlyPaymentDisplay').textContent = formatCurrency(Math.round(monthlyRepayment));
  document.getElementById('totalInterestDisplay').textContent = formatCurrency(Math.round(totalInterest));
  document.getElementById('totalPayableDisplay').textContent = formatCurrency(Math.round(totalPayable));
}

// ================= SAVINGS & DIVIDEND CALCULATOR LOGIC =================
function initSavingsCalculator() {
  const monthlySlider = document.getElementById('monthlySavingsRange');
  const yearsSlider = document.getElementById('savingsYearsRange');

  if (monthlySlider && yearsSlider) {
    monthlySlider.addEventListener('input', (e) => {
      currentMonthlySavings = parseFloat(e.target.value);
      document.getElementById('monthlySavingsDisplay').textContent = formatCurrency(currentMonthlySavings);
      calculateSavings();
    });

    yearsSlider.addEventListener('input', (e) => {
      currentSavingsYears = parseInt(e.target.value, 10);
      document.getElementById('savingsYearsDisplay').textContent = currentSavingsYears;
      calculateSavings();
    });

    calculateSavings();
  }
}

function selectSavingsProduct(type, annualRate) {
  currentDividendRate = annualRate;

  const buttons = document.querySelectorAll('.savings-type-btn');
  buttons.forEach(btn => {
    btn.classList.remove('border-brand-green', 'bg-emerald-50', 'text-brand-green', 'font-bold');
    btn.classList.add('border-slate-200', 'text-slate-700');
  });

  const eventTarget = event.currentTarget;
  if (eventTarget) {
    eventTarget.classList.remove('border-slate-200', 'text-slate-700');
    eventTarget.classList.add('border-brand-green', 'bg-emerald-50', 'text-brand-green', 'font-bold');
  }

  calculateSavings();
}

function calculateSavings() {
  const p = currentMonthlySavings;
  const years = currentSavingsYears;
  const months = years * 12;
  const monthlyRate = (currentDividendRate / 100) / 12;

  // Future Value of monthly annuity: FV = P * (( (1 + r)^n - 1 ) / r )
  const futureValue = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalDeposits = p * months;
  const totalDividends = futureValue - totalDeposits;

  document.getElementById('futureValueDisplay').textContent = formatCurrency(Math.round(futureValue));
  document.getElementById('totalDepositsDisplay').textContent = formatCurrency(Math.round(totalDeposits));
  document.getElementById('totalDividendsDisplay').textContent = formatCurrency(Math.round(totalDividends));
}

// Switch between Loan and Savings Tabs
function switchCalcTab(tab) {
  const loanPanel = document.getElementById('loanCalcPanel');
  const savingsPanel = document.getElementById('savingsCalcPanel');
  const tabLoanBtn = document.getElementById('tabLoanBtn');
  const tabSavingsBtn = document.getElementById('tabSavingsBtn');

  if (tab === 'loan') {
    loanPanel.classList.remove('hidden');
    savingsPanel.classList.add('hidden');
    tabLoanBtn.className = "px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-brand-navy bg-white shadow transition";
    tabSavingsBtn.className = "px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition";
  } else {
    loanPanel.classList.add('hidden');
    savingsPanel.classList.remove('hidden');
    tabLoanBtn.className = "px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition";
    tabSavingsBtn.className = "px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-brand-navy bg-white shadow transition";
  }
}

// Pre-fill application from calculator
function applyWithCalculatedLoan() {
  openModal('registerModal');
  showToast(`Pre-filling application for GHS ${formatCurrency(currentLoanAmount)} facility over ${currentLoanMonths} months.`, 'info');
}

// Helper Currency Formatter
function formatCurrency(num) {
  return num.toLocaleString('en-US');
}

// ================= MODALS & DRAWERS =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  ['registerModal', 'loginModal', 'momoModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (e.target === modal) {
      closeModal(id);
    }
  });
});

// Mobile Nav Toggle
function initMobileNav() {
  const btn = document.getElementById('mobileMenuBtn');
  if (btn) {
    btn.addEventListener('click', toggleMobileMenu);
  }

  const links = document.querySelectorAll('.mobile-nav-link');
  links.forEach(l => {
    l.addEventListener('click', () => {
      const drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.classList.add('hidden');
    });
  });
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
  }
}

// FAQ Accordion
function toggleFaq(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('i');
  
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

// ================= FORM SUBMISSION SIMULATION =================
function handleRegistration(e) {
  e.preventDefault();
  closeModal('registerModal');
  showToast("Application submitted! Your temporary Member ID is WES-" + Math.floor(10000 + Math.random() * 90000) + ". A representative will call you shortly.", "success");
  e.target.reset();
}

function handleLogin(e) {
  e.preventDefault();
  closeModal('loginModal');
  showToast("Demo Portal: Authentication verified. Welcome to WESCCU Online Banking!", "success");
  e.target.reset();
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-600' : (type === 'info' ? 'bg-brand-navy' : 'bg-amber-600');
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';

  toast.className = `toast-msg flex items-center gap-3 ${bgColor} text-white text-xs px-4 py-3 rounded-xl shadow-xl max-w-sm`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-sm"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
