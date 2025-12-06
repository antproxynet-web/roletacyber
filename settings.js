// Carregar configurações ao abrir a página
// Variáveis globais para o gerenciamento de roletas
let allWheels = {};
let currentWheelId = 'default';
let currentWheelName = 'Roleta Padrão';

// Funções de manipulação de roletas (duplicadas de main.js para evitar dependência)
function saveAllWheels() {
    localStorage.setItem('allWheels', JSON.stringify(allWheels));
    localStorage.setItem('currentWheelId', currentWheelId);
}

function saveCurrentWheel(animes, animeImages) {
    allWheels[currentWheelId] = {
        id: currentWheelId,
        name: currentWheelName,
        animes: animes,
        images: animeImages
    };
    saveAllWheels();
}

function loadWheel(id) {
    const wheel = allWheels[id];
    if (wheel) {
        currentWheelId = id;
        currentWheelName = wheel.name;
        saveAllWheels();
        return true;
    }
    return false;
}

function createNewWheel(name) {
    const newId = Date.now().toString();
    currentWheelId = newId;
    currentWheelName = name;
    saveCurrentWheel([], {}); // Salva uma roleta vazia
}

function deleteWheel(id) {
    if (Object.keys(allWheels).length <= 1) {
        alert('Não é possível excluir a última roleta.');
        return false;
    }
    
    if (confirm(`Tem certeza que deseja excluir a roleta "${allWheels[id].name}"?`)) {
        delete allWheels[id];
        saveAllWheels();
        
        // Carrega a primeira roleta restante
        currentWheelId = Object.keys(allWheels)[0];
        loadWheel(currentWheelId);
        return true;
    }
    return false;
}

function getAllWheels() {
    return Object.values(allWheels);
}

// Funções de UI
function renderWheelList() {
    const list = document.getElementById('wheelList');
    list.innerHTML = '';
    
    const wheels = getAllWheels();
    
    wheels.forEach(wheel => {
        const item = document.createElement('div');
        item.className = 'wheel-item';
        item.classList.toggle('active', wheel.id === currentWheelId);
        item.innerHTML = `
            <span>${wheel.name}</span>
            <div class="wheel-actions">
                <button class="btn-icon-only" onclick="loadWheelAndRefresh('${wheel.id}')" title="Carregar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                </button>
                <button class="btn-icon-only btn-remove" onclick="deleteWheelAndRefresh('${wheel.id}')" title="Excluir">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
    document.getElementById('currentWheelNameDisplay').textContent = currentWheelName;
}

function loadWheelAndRefresh(id) {
    if (loadWheel(id)) {
        window.location.href = 'index.html'; // Redireciona para aplicar a roleta
    }
}

function deleteWheelAndRefresh(id) {
    if (deleteWheel(id)) {
        renderWheelList();
    }
}

function createNewWheelFromSettings() {
    const newWheelNameInput = document.getElementById('newWheelName');
    const name = newWheelNameInput.value.trim();
    
    if (name === '') {
        alert('Por favor, insira um nome para a nova roleta.');
        return;
    }
    
    createNewWheel(name);
    newWheelNameInput.value = '';
    window.location.href = 'index.html'; // Redireciona para a nova roleta
}

function loadSettings() {
    const savedTheme = localStorage.getItem('animeWheelTheme') || 'classic';
    document.body.setAttribute('data-theme', savedTheme);
    updateActiveThemeButton(savedTheme);

    const noGlow = localStorage.getItem('noGlow') === 'true';
    document.getElementById('noGlowToggle').checked = noGlow;
    document.body.classList.toggle('no-glow', noGlow);

    // Carregar roletas
    const savedWheels = localStorage.getItem('allWheels');
    if (savedWheels) {
        allWheels = JSON.parse(savedWheels);
    }

    const savedCurrentWheelId = localStorage.getItem('currentWheelId');
    if (savedCurrentWheelId && allWheels[savedCurrentWheelId]) {
        currentWheelId = savedCurrentWheelId;
        currentWheelName = allWheels[savedCurrentWheelId].name;
    } else if (Object.keys(allWheels).length > 0) {
        currentWheelId = Object.keys(allWheels)[0];
        currentWheelName = allWheels[currentWheelId].name;
    } else {
        // Se não houver roletas, cria a padrão
        createNewWheel('Roleta Padrão');
    }

    // Renderizar a lista de roletas na página de configurações
    if (document.getElementById('wheelList')) {
        renderWheelList();
    }
}

function updateActiveThemeButton(theme) {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
}

function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    updateActiveThemeButton(theme);
    localStorage.setItem('animeWheelTheme', theme);
}



function saveSettings() {
    const noGlow = document.getElementById('noGlowToggle').checked;
    localStorage.setItem('noGlow', noGlow);

    alert('Configurações salvas com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Event listeners


function toggleNoGlow(isNoGlow) {
    document.body.classList.toggle('no-glow', isNoGlow);
}

// Inicializar
loadSettings();
