console.log('welcome.js carregado');
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar ícones Lucide
    lucide.createIcons();

    // Inicializar cliente Supabase
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabaseClient.auth.getSession();
    console.log('Sessão:', session);

    if (!session) {
        console.log('Usuário não autenticado, redirecionando para login');
        // Se não estiver autenticado, redirecionar para a página de login
        window.location.href = 'index.html';
        return;
    }

    // Atualizar o nome do usuário
    document.getElementById('userName').textContent = session.user.email;

    // Adicionar funcionalidade ao botão de logout
    document.getElementById('logoutButton').addEventListener('click', async () => {
        try {
            console.log('Iniciando logout...');
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            console.log('Logout bem-sucedido');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error.message);
            alert('Erro ao fazer logout: ' + error.message);
        }
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

