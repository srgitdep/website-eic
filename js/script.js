// ==================== NAVBAR ====================
(function() {
    const navbar = document.getElementById('navbar');
    const navbarNav = document.getElementById('navbarNav');
    
    // Criar botão mobile se não existir
    let mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (!mobileMenuBtn) {
        const btn = document.createElement('button');
        btn.id = 'mobileMenuBtn';
        btn.className = 'mobile-menu-btn';
        btn.innerHTML = '☰';
        navbar.appendChild(btn);
        mobileMenuBtn = btn;
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.remove('transparent');
            navbar.classList.add('solid');
        } else {
            navbar.classList.remove('solid');
            navbar.classList.add('transparent');
        }
    });
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
            this.innerHTML = navbarNav.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    if (navbarNav) {
        navbarNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navbarNav.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
})();

// ==================== BOTÕES CTA ====================
document.querySelectorAll('.cta-button, .navbar-cta, .system-cta-btn, .bunk-cta-btn, .matricula-cta-btn, .honor-cta-btn, .services-cta-btn, .maintenance-cta-btn, .fabrico-cta-btn, .sobre-nos-cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Obrigado pelo seu interesse! Em breve entraremos em contacto.');
    });
});

// ==================== FORMULÁRIO DE CONTACTO ====================
(function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Reset dos campos
        contactForm.addEventListener('reset', function() {
            this.querySelectorAll('input, select, textarea').forEach(field => {
                field.style.borderColor = '#e0e0e0';
            });
        });
        
        // Validação ao enviar
        contactForm.addEventListener('submit', function(e) {
            const nome = this.querySelector('input[name="nome"]');
            const email = this.querySelector('input[name="email"]');
            const telefone = this.querySelector('input[name="telefone"]');
            const assunto = this.querySelector('select[name="assunto"]');
            const mensagem = this.querySelector('textarea[name="mensagem"]');
            
            let hasError = false;
            let errorMessage = '';
            
            // Validar nome
            if (!nome.value.trim() || nome.value.trim().length < 3) {
                hasError = true;
                errorMessage += '• Por favor, insira seu nome completo.\n';
                nome.style.borderColor = '#ff4444';
            } else {
                nome.style.borderColor = '#4CAF50';
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                hasError = true;
                errorMessage += '• Por favor, insira um email válido.\n';
                email.style.borderColor = '#ff4444';
            } else {
                email.style.borderColor = '#4CAF50';
            }
            
            // Validar telefone
            const phoneRegex = /^[\+\d\s\-\(\)]{8,20}$/;
            if (!telefone.value.trim() || !phoneRegex.test(telefone.value.trim())) {
                hasError = true;
                errorMessage += '• Por favor, insira um número de telefone válido (mínimo 8 dígitos).\n';
                telefone.style.borderColor = '#ff4444';
            } else {
                telefone.style.borderColor = '#4CAF50';
            }
            
            // Validar assunto
            if (!assunto.value || assunto.value === '') {
                hasError = true;
                errorMessage += '• Por favor, selecione um assunto.\n';
                assunto.style.borderColor = '#ff4444';
            } else {
                assunto.style.borderColor = '#4CAF50';
            }
            
            // Validar mensagem
            if (!mensagem.value.trim() || mensagem.value.trim().length < 10) {
                hasError = true;
                errorMessage += '• Por favor, escreva uma mensagem com pelo menos 10 caracteres.\n';
                mensagem.style.borderColor = '#ff4444';
            } else {
                mensagem.style.borderColor = '#4CAF50';
            }
            
            if (hasError) {
                e.preventDefault();
                alert('⚠️ Por favor, corrija os seguintes erros:\n\n' + errorMessage);
                return false;
            }
            
            // Mostrar loading
            const submitBtn = this.querySelector('.contact-submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Restaurar após o envio (se houver erro)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
            
            return true;
        });
        
        // Remover bordas vermelhas ao digitar
        contactForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = '#e0e0e0';
            });
            field.addEventListener('change', function() {
                this.style.borderColor = '#e0e0e0';
            });
            field.addEventListener('focus', function() {
                this.style.borderColor = '#AF9C03';
            });
        });
    }
})();

// ==================== CARROSSEL HERO ====================
(function() {
    const heroSlides = document.querySelectorAll('.carrossel-slide');
    const heroPrevBtn = document.getElementById('carrosselPrevBtn');
    const heroNextBtn = document.getElementById('carrosselNextBtn');
    const heroIndicators = document.getElementById('carrosselIndicators');
    let heroCurrentIndex = 0;
    let heroAutoInterval;
    let heroIsHovering = false;

    function createHeroIndicators() {
        if (!heroIndicators) return;
        heroIndicators.innerHTML = '';
        heroSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carrossel-dot');
            if (index === heroCurrentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToHeroSlide(index));
            heroIndicators.appendChild(dot);
        });
    }

    function goToHeroSlide(index) {
        heroSlides[heroCurrentIndex].classList.remove('active');
        heroCurrentIndex = index;
        heroSlides[heroCurrentIndex].classList.add('active');
        const dots = document.querySelectorAll('.carrossel-dot');
        dots.forEach((dot, i) => { dot.classList.toggle('active', i === heroCurrentIndex); });
    }

    function nextHeroSlide() { goToHeroSlide((heroCurrentIndex + 1) % heroSlides.length); }
    function prevHeroSlide() { goToHeroSlide((heroCurrentIndex - 1 + heroSlides.length) % heroSlides.length); }

    function startHeroAutoSlide() {
        if (heroAutoInterval) clearInterval(heroAutoInterval);
        heroAutoInterval = setInterval(() => { if (!heroIsHovering) nextHeroSlide(); }, 4000);
    }

    const heroRightSection = document.querySelector('.right-section');
    if (heroRightSection) {
        heroRightSection.addEventListener('mouseenter', () => { heroIsHovering = true; clearInterval(heroAutoInterval); });
        heroRightSection.addEventListener('mouseleave', () => { heroIsHovering = false; startHeroAutoSlide(); });
    }

    if (heroPrevBtn) heroPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevHeroSlide(); });
    if (heroNextBtn) heroNextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextHeroSlide(); });

    if (heroSlides.length > 0) { createHeroIndicators(); startHeroAutoSlide(); }
})();

// ==================== CARROSSEL FABRICO ====================
(function() {
    const slides = document.querySelectorAll('.fabrico-carrossel-slide');
    const prevBtn = document.getElementById('fabricoPrevBtn');
    const nextBtn = document.getElementById('fabricoNextBtn');
    const indicatorsContainer = document.getElementById('fabricoIndicators');
    let currentIndex = 0;
    let autoInterval;
    let isHovering = false;

    function createIndicators() {
        if (!indicatorsContainer) return;
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('fabrico-dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(dot);
        });
    }

    function updateIndicators() {
        const dots = document.querySelectorAll('.fabrico-dot');
        dots.forEach((dot, index) => { dot.classList.toggle('active', index === currentIndex); });
    }

    function goToSlide(index) {
        slides[currentIndex].classList.remove('active');
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        updateIndicators();
        resetAutoSlide();
    }

    function nextSlide() { goToSlide((currentIndex + 1) % slides.length); }
    function prevSlide() { goToSlide((currentIndex - 1 + slides.length) % slides.length); }

    function startAutoSlide() { if (autoInterval) clearInterval(autoInterval); autoInterval = setInterval(() => { if (!isHovering) nextSlide(); }, 5000); }
    function stopAutoSlide() { if (autoInterval) clearInterval(autoInterval); }
    function resetAutoSlide() { stopAutoSlide(); startAutoSlide(); }

    const carrosselContainer = document.querySelector('.fabrico-carrossel-container');
    if (carrosselContainer) {
        carrosselContainer.addEventListener('mouseenter', () => { isHovering = true; stopAutoSlide(); });
        carrosselContainer.addEventListener('mouseleave', () => { isHovering = false; startAutoSlide(); });
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });

    if (slides.length > 0) { createIndicators(); startAutoSlide(); }
})();
// ==================== CARROSSEL DE IMAGENS DOS CARDS ====================
function initAllImageCarousels() {
    console.log('Inicializando carrosséis de imagens...');
    
    const photoContainers = document.querySelectorAll('.card-photo-container');
    
    console.log('Encontrados ' + photoContainers.length + ' containers de fotos');
    
    photoContainers.forEach((container, containerIndex) => {
        const photos = container.querySelectorAll('.card-photo');
        const numPhotos = photos.length;
        
        console.log('Container ' + containerIndex + ' tem ' + numPhotos + ' fotos');
        
        if (numPhotos <= 1) return;
        
        let currentIndex = 0;
        
        photos.forEach((photo, idx) => {
            photo.classList.remove('active');
            if (idx === 0) {
                photo.classList.add('active');
                console.log('Ativando primeira foto do container ' + containerIndex);
            }
        });
        
        setInterval(() => {
            photos[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % numPhotos;
            photos[currentIndex].classList.add('active');
            console.log('Container ' + containerIndex + ': trocando para foto ' + currentIndex);
        }, 4000);
    });
}

function initMaintenanceCarousels() {
    const maintenanceCards = document.querySelectorAll('.industrial-maintenance-section .maintenance-card');
    console.log('Cards de manutenção encontrados: ' + maintenanceCards.length);
    
    maintenanceCards.forEach((card, cardIndex) => {
        const photos = card.querySelectorAll('.card-photo');
        const numPhotos = photos.length;
        
        if (numPhotos <= 1) return;
        
        let currentIndex = 0;
        
        photos.forEach((photo, idx) => {
            photo.classList.remove('active');
            if (idx === 0) photo.classList.add('active');
        });
        
        setInterval(() => {
            photos[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % numPhotos;
            photos[currentIndex].classList.add('active');
        }, 4000);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - iniciando carrosséis');
    initAllImageCarousels();
    initMaintenanceCarousels();
});

window.addEventListener('load', function() {
    console.log('Página completamente carregada - reiniciando carrosséis');
    initAllImageCarousels();
    initMaintenanceCarousels();
});

// ==================== BOTÕES ESPECÍFICOS ====================
const agricultureCtaBtn = document.getElementById('agricultureCtaBtn');
if (agricultureCtaBtn) {
    agricultureCtaBtn.addEventListener('click', () => alert('🌱 Solicitação de consultoria agrícola recebida! Entraremos em contacto em breve.'));
}

const fabricoCtaBtn = document.getElementById('fabricoCtaBtn');
if (fabricoCtaBtn) {
    fabricoCtaBtn.addEventListener('click', () => alert('📐 Solicitação de orçamento para Fabrico de Estruturas recebida!'));
}

document.querySelectorAll('.fabrico-card-btn, .service-link, .system-read-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('🔧 Entre em contacto para saber mais sobre os nossos serviços.');
    });
});

// ==================== WHATSAPP TOOLTIP ====================
setTimeout(() => {
    const tooltip = document.querySelector('.whatsapp-tooltip');
    if (tooltip) { 
        tooltip.style.opacity = '0'; 
        setTimeout(() => { tooltip.style.visibility = 'hidden'; }, 500); 
    }
}, 8000);

// ==================== BOTÃO STANDARDIZAÇÃO ====================
const standardizationBtn = document.getElementById('standardizationBtn');
if (standardizationBtn) {
    standardizationBtn.addEventListener('click', () => {
        alert('📄 Nossa política de qualidade está disponível. Solicite por email: geral@eic-lda.co.mz');
    });
}

// ==================== BOTÃO SOBRE NÓS ====================
const sobreNosCtaBtn = document.getElementById('sobreNosCtaBtn');
if (sobreNosCtaBtn) {
    sobreNosCtaBtn.addEventListener('click', () => {
        alert('📄 Conheça nossa política de qualidade e certificações. Solicite por email: geral@eic-lda.co.mz');
    });
}

// ==================== SCROLL DO CARROSSEL DE PROJETOS ====================
function scrollCarrossel(direction) {
    const container = document.getElementById('carrosselProjetos');
    if (container) {
        const scrollAmount = 320;
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

let autoScrollInterval;
const carrosselContainer = document.getElementById('carrosselProjetos');

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (carrosselContainer) {
            const maxScroll = carrosselContainer.scrollWidth - carrosselContainer.clientWidth;
            if (carrosselContainer.scrollLeft >= maxScroll - 10) {
                carrosselContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carrosselContainer.scrollBy({ left: 320, behavior: 'smooth' });
            }
        }
    }, 4000);
}

if (carrosselContainer) {
    carrosselContainer.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carrosselContainer.addEventListener('mouseleave', startAutoScroll);
    startAutoScroll();
}

// ==================== BOTÕES CTA ====================
document.querySelectorAll('.cta-button, .navbar-cta, .system-cta-btn, .bunk-cta-btn, .matricula-cta-btn, .honor-cta-btn, .services-cta-btn, .maintenance-cta-btn, .fabrico-cta-btn, .sobre-nos-cta-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Obrigado pelo seu interesse! Em breve entraremos em contacto.');
    });
});