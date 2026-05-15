/* ============================================
   GUÍA GIT INTERACTIVA - Edwin Arellano
   Interactividad y animaciones
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    initCounterAnimation();
    initSearch();
    initFilters();
    initCopyButtons();
    initRunButtons();
    initThemeToggle();
    initSmoothScroll();
    initNavbarScroll();
    initKeyboardShortcuts();
    initModal();
    initWorkspaceCards();
});

/* ============================================
   PARTÍCULAS DE FONDO
   ============================================ */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * duration;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
        `;

        container.appendChild(particle);
    }
}

/* ============================================
   EFECTO DE ESCRITURA EN TERMINAL
   ============================================ */
function initTypingEffect() {
    const commands = document.querySelectorAll('.command.typing');
    let currentIndex = 0;

    function typeCommand(element, text, callback) {
        let i = 0;
        element.textContent = '';

        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;

            if (i >= text.length) {
                clearInterval(interval);
                element.classList.remove('typing');
                if (callback) callback();
            }
        }, 80);
    }

    function startTyping() {
        if (currentIndex >= commands.length) {
            currentIndex = 0;
            setTimeout(startTyping, 3000);
            return;
        }

        const cmd = commands[currentIndex];
        const text = cmd.dataset.text || cmd.textContent;

        cmd.classList.add('typing');
        typeCommand(cmd, text, () => {
            currentIndex++;
            setTimeout(startTyping, 600);
        });
    }

    setTimeout(startTyping, 1000);
}

/* ============================================
   ANIMACIÓN DE CONTADORES
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/* ============================================
   BÚSQUEDA DE COMANDOS
   ============================================ */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterCommands(query);
    });

    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.style.transform = 'scale(1)';
    });
}

function filterCommands(query) {
    const cards = document.querySelectorAll('.command-card');

    cards.forEach(card => {
        const command = card.dataset.command?.toLowerCase() || '';
        const desc = card.querySelector('.command-desc')?.textContent.toLowerCase() || '';
        const name = card.querySelector('.command-name')?.textContent.toLowerCase() || '';

        const matches = command.includes(query) || 
                       desc.includes(query) || 
                       name.includes(query);

        if (matches || query === '') {
            card.style.display = '';
            card.style.animation = 'fade-in-up 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ============================================
   FILTROS POR CATEGORÍA
   ============================================ */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            filterByCategory(filter);
        });
    });
}

function filterByCategory(category) {
    const cards = document.querySelectorAll('.command-card');

    cards.forEach((card, index) => {
        const categories = card.dataset.category?.split(' ') || [];

        if (category === 'all' || categories.includes(category)) {
            card.style.display = '';
            card.style.animation = `fade-in-up 0.4s ease ${index * 0.05}s forwards`;
        } else {
            card.style.display = 'none';
        }
    });
}

/* ============================================
   BOTONES DE COPIAR
   ============================================ */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const cmd = btn.dataset.cmd;

            try {
                await navigator.clipboard.writeText(cmd);
                showTooltip(btn);
                showToast(`"${cmd}" copiado al portapapeles`);
            } catch (err) {
                const textarea = document.createElement('textarea');
                textarea.value = cmd;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showTooltip(btn);
                showToast(`"${cmd}" copiado al portapapeles`);
            }
        });
    });
}

function showTooltip(button) {
    const tooltip = button.querySelector('.copy-tooltip');
    if (!tooltip) return;

    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 2000);
}

/* ============================================
   BOTONES DE EJECUTAR (SIMULACIÓN)
   ============================================ */
function initRunButtons() {
    const runBtns = document.querySelectorAll('.run-btn');

    runBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cmd = btn.dataset.cmd;
            openModal(cmd);
        });
    });
}

/* ============================================
   TOAST NOTIFICACIONES
   ============================================ */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ============================================
   MODAL DE SIMULACIÓN
   ============================================ */
function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');

    if (!overlay || !closeBtn) return;

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openModal(command) {
    const overlay = document.getElementById('modalOverlay');
    const cmdEl = document.getElementById('modalCommand');
    const outputEl = document.getElementById('modalOutput');

    if (!overlay || !cmdEl || !outputEl) return;

    cmdEl.textContent = command;
    outputEl.textContent = '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    simulateTerminalOutput(command, outputEl);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function simulateTerminalOutput(command, outputEl) {
    const outputs = {
        'git init': 'Initialized empty Git repository in /proyecto/.git/

Repositorio listo para usar.',
        'git clone': 'Cloning into 'repo'...
remote: Enumerating objects: 100, done.
Receiving objects: 100% (100/100), done.
Resolving deltas: 100% (40/40), done.',
        'git add': 'Changes staged for next commit.

Use "git status" to see what's ready.',
        'git commit': '[main a1b2c3d] Agrega navbar responsive
 2 files changed, 45 insertions(+)
 create mode 100644 navbar.js',
        'git status': 'On branch main
Changes to be committed:
  (use "git restore --staged..." to unstage)
        modified:   style.css

Untracked files:
  (use "git add <file>..." to include)
        new-file.js',
        'git branch': '* main
  feature/login
  feature/header
  remotes/origin/main',
        'git checkout': 'Switched to branch 'main'
Your branch is up to date with 'origin/main'.',
        'git merge': 'Merge made by the 'ort' strategy.
 style.css | 10 ++++++++++
 1 file changed, 10 insertions(+)',
        'git push': 'Enumerating objects: 5, done.
Writing objects: 100% (5/5), 450 bytes, done.
To github.com:usuario/repo.git
   a1b2c3d..e4f5g6h  main -> main',
        'git pull': 'remote: Enumerating objects: 3, done.
From github.com:usuario/repo
 * branch            main     -> FETCH_HEAD
Updating a1b2c3d..e4f5g6h
Fast-forward
 index.html | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)',
        'git log': 'a1b2c3d (HEAD -> main) Agrega footer
b2c3d4e Corrige responsive
c3d4e5f Primer commit',
        'git stash': 'Saved working directory and index state
On main: WIP: navbar

Changes stashed. Use "git stash pop" to recover.',
        'git rebase': 'Successfully rebased and updated feature.

Historial lineal creado.',
        'git reset': 'HEAD is now at a1b2c3d

Commit deshecho. Los cambios se mantienen en staging (--soft).'
    };

    let output = 'Ejecutando comando...

Comando completado exitosamente.';
    for (const [key, value] of Object.entries(outputs)) {
        if (command.includes(key)) {
            output = value;
            break;
        }
    }

    outputEl.textContent = '';
    const lines = output.split('
');
    let lineIndex = 0;

    const interval = setInterval(() => {
        if (lineIndex >= lines.length) {
            clearInterval(interval);
            return;
        }

        outputEl.textContent += (lineIndex > 0 ? '
' : '') + lines[lineIndex];
        lineIndex++;
    }, 150);
}

/* ============================================
   TOGGLE DE TEMA CLARO/OSCURO
   ============================================ */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('git-guide-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('git-guide-theme', isLight ? 'light' : 'dark');
    });
}

/* ============================================
   SCROLL SUAVE
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            navbar.style.background = document.body.classList.contains('light-mode') 
                ? 'rgba(250, 250, 250, 0.95)' 
                : 'rgba(15, 15, 26, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = document.body.classList.contains('light-mode')
                ? 'rgba(250, 250, 250, 0.85)'
                : 'rgba(15, 15, 26, 0.8)';
        }

        lastScroll = currentScroll;
    });

    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   ATAJOS DE TECLADO
   ============================================ */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
                // Scroll a la sección de todos los comandos
                const allCommandsSection = document.getElementById('todos-comandos');
                if (allCommandsSection) {
                    allCommandsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }

        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

/* ============================================
   TARJETAS DEL ÁREA DE TRABAJO
   ============================================ */
function initWorkspaceCards() {
    const workspaceCards = document.querySelectorAll('.workspace-card');

    workspaceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--primary-light)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '';
        });
    });
}

/* ============================================
   EFECTO DE PARALLAX SUAVE EN HERO
   ============================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const terminal = document.querySelector('.terminal-window');

    if (hero && terminal && scrolled < window.innerHeight) {
        terminal.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

/* ============================================
   ANIMACIÓN DE ENTRADA PARA ELEMENTOS
   ============================================ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.workflow-section, .author-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});
