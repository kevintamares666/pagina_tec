/**
 * ====================================================================
 * SERVICIO TÉCNICO EL KEVIN Y EL BRAYAN
 * Lógica de Autenticación, Validación y Panel de Cliente
 * ====================================================================
 */

// ====================================================================
// 1. CAPA DE BASE DE DATOS / API (PREPARADO PARA CONEXIÓN FUTURA)
// ====================================================================
/**
 * Este objeto simula la conexión con tu backend o base de datos (MySQL, PHP, Node.js, Firebase, Supabase, etc.).
 * Actualmente utiliza `localStorage` para que puedas probar la aplicación de inmediato en tu navegador.
 * 
 * Cuando vayas a enlazar tu base de datos real:
 * Simplemente reemplaza el contenido de estos métodos por llamadas `fetch('/tu-api/registro')` o `fetch('/tu-api/login')`.
 */
const DatabaseService = {
  STORAGE_KEY_USERS: 'kevin_brayan_users_db',
  STORAGE_KEY_SESSION: 'kevin_brayan_active_session',

  // Obtener todos los usuarios registrados (Mock DB)
  getUsers() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error al leer la base de datos local:', e);
      return [];
    }
  },

  // Guardar un nuevo usuario cliente en la Base de Datos
  async registerUser(phone, password) {
    // SIMULACIÓN DE LATENCIA DE RED (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));

    /* =============================================================
       AQUÍ PODRÁS ENLAZAR TU BASE DE DATOS REAL CON FETCH:
       
       const response = await fetch('https://tu-servidor.com/api/registro.php', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ phone, password })
       });
       return await response.json();
       ============================================================= */

    const users = this.getUsers();
    
    // Verificar si el número de celular ya está registrado
    const exists = users.find(u => u.phone === phone);
    if (exists) {
      return { success: false, message: 'Este número de celular ya tiene una cuenta registrada.' };
    }

    const newUser = {
      id: 'CLI-' + Date.now(),
      phone: phone,
      password: password, // En producción real, la clave debe viajar cifrada o hashearse en servidor (bcrypt)
      createdAt: new Date().toISOString(),
      role: 'cliente'
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));

    return { 
      success: true, 
      message: '¡Cuenta creada exitosamente en Servicio Técnico El Kevin y El Brayan!',
      user: { id: newUser.id, phone: newUser.phone }
    };
  },

  // Autenticar / Iniciar Sesión de usuario
  async loginUser(phone, password) {
    // SIMULACIÓN DE LATENCIA DE RED (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));

    /* =============================================================
       AQUÍ PODRÁS ENLAZAR TU BASE DE DATOS REAL CON FETCH:
       
       const response = await fetch('https://tu-servidor.com/api/login.php', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ phone, password })
       });
       return await response.json();
       ============================================================= */

    const users = this.getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
      return { success: false, message: 'Número de celular o contraseña incorrectos.' };
    }

    return {
      success: true,
      message: '¡Bienvenido de nuevo al taller!',
      user: { id: user.id, phone: user.phone }
    };
  },

  // Guardar sesión activa actual
  saveSession(user) {
    localStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(user));
  },

  // Obtener sesión activa actual
  getSession() {
    try {
      const session = localStorage.getItem(this.STORAGE_KEY_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  // Cerrar sesión
  clearSession() {
    localStorage.removeItem(this.STORAGE_KEY_SESSION);
  }
};


// ====================================================================
// 2. SISTEMA DE NOTIFICACIONES TOAST (FEEDBACK VISUAL ELEGANTE)
// ====================================================================
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Iconos según el tipo
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-message">${message}</div>
  `;

  container.appendChild(toast);

  // Auto-eliminar después de la duración
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }, duration);
}


// ====================================================================
// 3. CONTROLADOR DE VISTAS (LOGIN VS HOME)
// ====================================================================
const ViewManager = {
  authView: document.getElementById('auth-view'),
  homeView: document.getElementById('home-view'),
  userDisplayPhone: document.getElementById('user-display-phone'),

  showAuth() {
    this.homeView.classList.remove('active-view');
    setTimeout(() => {
      this.homeView.style.display = 'none';
      this.authView.style.display = 'block';
      setTimeout(() => this.authView.classList.add('active-view'), 20);
    }, 200);
  },

  showHome(user) {
    if (this.userDisplayPhone && user) {
      this.userDisplayPhone.textContent = user.phone;
    }
    this.authView.classList.remove('active-view');
    setTimeout(() => {
      this.authView.style.display = 'none';
      this.homeView.style.display = 'block';
      setTimeout(() => this.homeView.classList.add('active-view'), 20);
    }, 200);
  }
};


// ====================================================================
// 4. GESTOR DE EVENTOS Y VALIDACIONES DEL DOM
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Elementos de Pestañas
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const registerFormPanel = document.getElementById('register-form-panel');
  const loginFormPanel = document.getElementById('login-form-panel');

  // Formularios
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  // Campos de Registro
  const regPhoneInput = document.getElementById('reg-phone');
  const regPasswordInput = document.getElementById('reg-password');
  const charCounter = document.getElementById('char-counter');
  const meterBar = document.getElementById('meter-bar');
  const passRequirement = document.getElementById('pass-requirement');

  // Campos de Login
  const loginPhoneInput = document.getElementById('login-phone');
  const loginPasswordInput = document.getElementById('login-password');

  // Botones de mostrar/ocultar contraseña
  const toggleRegPass = document.getElementById('toggle-reg-pass');
  const toggleLoginPass = document.getElementById('toggle-login-pass');

  // Botón de Cerrar Sesión
  const btnLogout = document.getElementById('btn-logout');

  // --- A. Alternancia de Pestañas (Crear Cuenta / Iniciar Sesión) ---
  tabRegisterBtn.addEventListener('click', () => {
    tabRegisterBtn.classList.add('active');
    tabRegisterBtn.setAttribute('aria-selected', 'true');
    tabLoginBtn.classList.remove('active');
    tabLoginBtn.setAttribute('aria-selected', 'false');

    registerFormPanel.classList.add('active');
    loginFormPanel.classList.remove('active');
  });

  tabLoginBtn.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabLoginBtn.setAttribute('aria-selected', 'true');
    tabRegisterBtn.classList.remove('active');
    tabRegisterBtn.setAttribute('aria-selected', 'false');

    loginFormPanel.classList.add('active');
    registerFormPanel.classList.remove('active');
  });

  // --- B. Mostrar / Ocultar Contraseña ---
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;
    button.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      
      const eyeOpen = button.querySelector('.eye-open');
      const eyeClosed = button.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }
  setupPasswordToggle(toggleRegPass, regPasswordInput);
  setupPasswordToggle(toggleLoginPass, loginPasswordInput);

  // --- C. Validación en Tiempo Real: Contraseña de 8 Caracteres ---
  regPasswordInput.addEventListener('input', (e) => {
    const value = e.target.value;
    const len = value.length;

    // Actualizar contador numérico
    charCounter.textContent = `${len} / 8 caracteres`;

    // Barra de progreso (0% a 100%)
    const percentage = Math.min((len / 8) * 100, 100);
    meterBar.style.width = `${percentage}%`;

    if (len === 8) {
      charCounter.classList.add('valid');
      charCounter.classList.remove('invalid');
      meterBar.classList.add('complete');
      passRequirement.classList.add('valid');
    } else {
      charCounter.classList.remove('valid');
      if (len > 0) charCounter.classList.add('invalid');
      meterBar.classList.remove('complete');
      passRequirement.classList.remove('valid');
    }
  });

  // --- D. Formateo y Limpieza amigable del Celular ---
  function formatPhoneInput(input) {
    input.addEventListener('input', (e) => {
      // Permite números, espacios y el signo '+'
      e.target.value = e.target.value.replace(/[^0-9+\s]/g, '');
    });
  }
  formatPhoneInput(regPhoneInput);
  formatPhoneInput(loginPhoneInput);

  // --- E. Procesamiento del Formulario: CREAR CUENTA CLIENTE ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = regPhoneInput.value.trim();
    const password = regPasswordInput.value;

    // Validar Celular
    if (!phone || phone.length < 8) {
      showToast('Por favor, ingresa un número de celular válido (mínimo 8 dígitos).', 'error');
      regPhoneInput.focus();
      return;
    }

    // Validar Contraseña de 8 Caracteres Exactos (Requisito Estricto)
    if (password.length !== 8) {
      showToast(`La contraseña debe tener exactamente 8 caracteres. (Tienes ${password.length})`, 'error');
      regPasswordInput.focus();
      return;
    }

    // Mostrar estado de carga en el botón
    const submitBtn = document.getElementById('btn-submit-register');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnArrow = submitBtn.querySelector('.btn-arrow');

    submitBtn.disabled = true;
    btnText.textContent = 'Creando cuenta...';
    btnSpinner.style.display = 'inline-block';
    btnArrow.style.display = 'none';

    try {
      // Llamada a la capa de Base de Datos
      const result = await DatabaseService.registerUser(phone, password);

      if (result.success) {
        showToast(result.message, 'success');
        DatabaseService.saveSession(result.user);
        
        // Limpiar formulario
        registerForm.reset();
        charCounter.textContent = '0 / 8 caracteres';
        meterBar.style.width = '0%';
        passRequirement.classList.remove('valid');

        // Redirigir al Home de Servicio Técnico
        setTimeout(() => {
          ViewManager.showHome(result.user);
          showToast(`¡Hola! Estás en el panel oficial de Servicio Técnico El Kevin y El Brayan`, 'info');
        }, 600);
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) {
      showToast('Ocurrió un problema de conexión. Intenta de nuevo.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Crear Cuenta cliente';
      btnSpinner.style.display = 'none';
      btnArrow.style.display = 'block';
    }
  });

  // --- F. Procesamiento del Formulario: INICIAR SESIÓN ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = loginPhoneInput.value.trim();
    const password = loginPasswordInput.value;

    if (!phone) {
      showToast('Por favor, ingresa tu número de celular.', 'error');
      loginPhoneInput.focus();
      return;
    }

    if (!password) {
      showToast('Por favor, ingresa tu contraseña.', 'error');
      loginPasswordInput.focus();
      return;
    }

    // Mostrar estado de carga
    const submitBtn = document.getElementById('btn-submit-login');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const btnArrow = submitBtn.querySelector('.btn-arrow');

    submitBtn.disabled = true;
    btnText.textContent = 'Ingresando...';
    btnSpinner.style.display = 'inline-block';
    btnArrow.style.display = 'none';

    try {
      const result = await DatabaseService.loginUser(phone, password);

      if (result.success) {
        showToast(result.message, 'success');
        DatabaseService.saveSession(result.user);
        loginForm.reset();

        setTimeout(() => {
          ViewManager.showHome(result.user);
        }, 500);
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) {
      showToast('Error al conectar con el servidor.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Ingresar al Taller';
      btnSpinner.style.display = 'none';
      btnArrow.style.display = 'block';
    }
  });

  // --- G. Cerrar Sesión ---
  btnLogout.addEventListener('click', () => {
    DatabaseService.clearSession();
    ViewManager.showAuth();
    showToast('Has cerrado sesión correctamente.', 'info');
  });

  // --- H. Controlador del Carrusel de Celulares 2D (Enfermo a 100%) ---
  function initPhoneCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    const carouselWrapper = document.getElementById('phone-carousel');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const dots = dotsContainer.querySelectorAll('.dot-btn');
    let currentIndex = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      // Mover el carrusel mediante transform translateX
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Actualizar estado de los puntos de paginación
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Botones Siguiente y Anterior
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    });

    // Clicks en los Puntos
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        goToSlide(index);
        resetAutoPlay();
      });
    });

    // Auto-reproducción suave cada 4.5 segundos
    function startAutoPlay() {
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Pausar si el usuario pone el cursor sobre el carrusel
    if (carouselWrapper) {
      carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
      carouselWrapper.addEventListener('mouseleave', startAutoPlay);
    }

    // Iniciar auto-play
    startAutoPlay();
  }

  initPhoneCarousel();

  // --- I. Comprobación Inicial de Sesión Existente ---
  const activeSession = DatabaseService.getSession();
  if (activeSession) {
    ViewManager.showHome(activeSession);
  } else {
    // Si no hay sesión, asegurar que la vista de Auth esté activa
    ViewManager.showAuth();
  }
});


// ====================================================================
// 5. INTERACCIONES DEL HOME (EXPANDIBLE PARA FUTURAS OPCIONES)
// ====================================================================
window.appInterface = {
  handleOptionClick(optionName) {
    if (optionName === 'Contacto WhatsApp') {
      showToast('⚡ Conectando con WhatsApp de El Kevin y El Brayan...', 'success');
      // Puedes reemplazar por tu enlace de WhatsApp real cuando lo desees:
      // window.open('https://wa.me/569XXXXXXXX?text=Hola%20Kevin%20y%20Brayan%2C%20necesito%20servicio%20tecnico', '_blank');
      return;
    }

    showToast(`Has seleccionado: ${optionName}. (Listo para conectar con tu lógica o base de datos)`, 'info');
  }
};
