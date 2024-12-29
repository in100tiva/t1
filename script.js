document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar ícones Lucide
    lucide.createIcons();

    // Inicializar cliente Supabase
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Verificar se o usuário já está autenticado
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = 'welcome.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const togglePasswordButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = passwordInput.value;

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            console.log('Login bem-sucedido:', data);
            alert('Login bem-sucedido! Redirecionando para a página de boas-vindas...');

            // Redirecionar para a página de boas-vindas
            window.location.href = 'welcome.html';
        } catch (error) {
            console.error('Erro no login:', error.message);
            alert('Erro no login: ' + error.message);
        }
    });

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordButton.querySelector('i').setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
        lucide.createIcons();
    });

    // Liquid Canvas
    const DEFAULT = {
        dot: '#B2DFDB',
        width: window.innerWidth,
        height: window.innerHeight,
        size: 30 + Math.random() * 30,
        count: 300
    }

    const dots = [];

    const canvas = document.getElementById('liquidCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = DEFAULT.width;
    canvas.height = DEFAULT.height;

    ctx.fillStyle = DEFAULT.bg;
    ctx.fillRect(0, 0, DEFAULT.width, DEFAULT.height);

    class Rectangle {
        constructor(x, y) {
            this.pos = { x, y }
            this.radius = DEFAULT.size;

            this.vel = {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1
            }
        }

        move() {
            if (this.radius > 10) {
                this.radius *= 0.99;
            }

            this.vel.x *= 0.99;
            this.vel.y *= 0.99;

            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
        }

        draw(dot, ctx) {
            ctx.fillStyle = DEFAULT.dot;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
            ctx.closePath();
            ctx.fill();
        }
    };

    function onMouse(e) {
        const dot = new Rectangle(e.clientX, e.clientY);
        dots.push(dot);
    }

    function draw() {
        ctx.clearRect(0, 0, DEFAULT.width, DEFAULT.height);

        dots.forEach((dot, index) => {
            dot.move();
            dot.draw(dot, ctx)

            if (dot.vel.x < 0.1) {
                dots.splice(index, 1);
            }
        });
    }

    function Render() {
        draw();
        window.requestAnimationFrame(Render);
    }

    Render();

    canvas.addEventListener('mousemove', onMouse);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        DEFAULT.width = window.innerWidth;
        DEFAULT.height = window.innerHeight;
    });
});

