// Игровые переменные
let energy = 0;
let level = 1;
let currentEnemyHealth = 100;
let maxEnemyHealth = 100;
let clickDamage = 1;
let enemyDefeated = 0;

// Оружие
const weapons = [
    { id: 1, name: "Лазерный пистолет", damage: 1, cost: 50, img: "🔫", owned: false },
    { id: 2, name: "Плазменная пушка", damage: 5, cost: 200, img: "💥", owned: false },
    { id: 3, name: "Квантовый меч", damage: 10, cost: 500, img: "⚔️", owned: false },
    { id: 4, name: "Гравитационная бомба", damage: 20, cost: 1000, img: "💣", owned: false },
];

// Навыки
const skills = [
    { id: 1, name: "Улучшенные клики", description: "+1 урон за клик", cost: 100, unlocked: false },
    { id: 2, name: "Критический удар", description: "Шанс 10% на 2x урон", cost: 200, unlocked: false },
    { id: 3, name: "Авто-стрельба", description: "1 урон каждую секунду", cost: 300, unlocked: false },
];

// Элементы DOM
const energyElement = document.getElementById('energy');
const levelElement = document.getElementById('level');
const healthElement = document.getElementById('health');
const enemyImg = document.getElementById('enemy-img');
const clickArea = document.getElementById('click-area');
const clickEffect = document.getElementById('click-effect');
const weaponsContainer = document.getElementById('weapons');
const skillTreeContainer = document.getElementById('skill-tree');

// Клик по врагу
clickArea.addEventListener('click', (e) => {
    // Урон врагу
    currentEnemyHealth -= clickDamage;
    updateEnemyHealth();

    // Эффект клика
    const x = e.clientX - clickArea.getBoundingClientRect().left;
    const y = e.clientY - clickArea.getBoundingClientRect().top;
    clickEffect.style.left = `${x - 25}px`;
    clickEffect.style.top = `${y - 25}px`;
    clickEffect.style.opacity = '1';
    setTimeout(() => { clickEffect.style.opacity = '0'; }, 300);

    // Проверка смерти врага
    if (currentEnemyHealth <= 0) {
        defeatEnemy();
    }
});

// Обновление здоровья врага
function updateEnemyHealth() {
    const healthPercent = (currentEnemyHealth / maxEnemyHealth) * 100;
    healthElement.style.width = `${healthPercent}%`;
}

// Победа над врагом
function defeatEnemy() {
    energy += maxEnemyHealth / 10;
    enemyDefeated++;
    updateStats();

    // Новый враг
    currentEnemyHealth = maxEnemyHealth = 100 + (level * 20);
    updateEnemyHealth();

    // Проверка уровня
    if (enemyDefeated >= 5) {
        levelUp();
    }
}

// Увеличение уровня
function levelUp() {
    level++;
    enemyDefeated = 0;
    levelElement.textContent = level;
    unlockNewWeapons();
}

// Разблокировка оружия
function unlockNewWeapons() {
    weaponsContainer.innerHTML = '';
    weapons.forEach(weapon => {
        if (weapon.owned || weapon.cost > energy) return;
        const weaponElement = document.createElement('div');
        weaponElement.className = 'weapon';
        weaponElement.innerHTML = `
            <div style="font-size: 2rem;">${weapon.img}</div>
            <h3>${weapon.name}</h3>
            <p>Урон: +${weapon.damage}</p>
            <p>Цена: ${weapon.cost} энергии</p>
        `;
        weaponElement.addEventListener('click', () => {
            if (energy >= weapon.cost) {
                energy -= weapon.cost;
                weapon.owned = true;
                clickDamage += weapon.damage;
                updateStats();
                weaponElement.style.borderColor = '#00ff00';
            }
        });
        weaponsContainer.appendChild(weaponElement);
    });
}

// Обновление статистики
function updateStats() {
    energyElement.textContent = Math.floor(energy);
}

// Инициализация игры
function initGame() {
    updateStats();
    unlockNewWeapons();
}

initGame();
