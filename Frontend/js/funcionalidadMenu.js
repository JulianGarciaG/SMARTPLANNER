const abrirMenu = document.getElementById('abrir-menu');
const menu = document.getElementById('menu');

abrirMenu.addEventListener('click', () => {
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
        console.log('Menu cerrado');
    } else {
        menu.style.display = 'flex';
        console.log('Menu abierto');
    }
});
