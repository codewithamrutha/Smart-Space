// DEMO ONLY: localStorage is not secure enough for real user accounts.
const signupForm = document.getElementById('signupForm');
const formMessage = document.getElementById('formMessage');

signupForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  formMessage.className = 'form-message';
  formMessage.textContent = '';

  if (password.length < 6) {
    formMessage.textContent = 'Password must contain at least 6 characters.';
    formMessage.classList.add('error');
    return;
  }
  if (password !== confirmPassword) {
    formMessage.textContent = 'The passwords do not match. Please try again.';
    formMessage.classList.add('error');
    return;
  }

  const users = JSON.parse(localStorage.getItem('smartspaceUsers') || '[]');
  if (users.some(user => user.email === email)) {
    formMessage.textContent = 'An account with this email already exists. Please sign in.';
    formMessage.classList.add('error');
    return;
  }

  // For a classroom prototype only. Never store plain-text passwords in a real app.
  users.push({ name, email, password });
  localStorage.setItem('smartspaceUsers', JSON.stringify(users));
  localStorage.setItem('smartspaceUser', email);

  formMessage.textContent = 'Account created! Taking you to the sign-in page…';
  formMessage.classList.add('success');
  signupForm.reset();
  setTimeout(() => { window.location.href = 'index.html'; }, 900);
});
