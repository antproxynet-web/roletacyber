let animes = [];
let allWheels = {}; // Armazenar todas as roletas salvas
let currentWheelId = 'default'; // ID da roleta atual
let currentWheelName = 'Roleta Padrão'; // Nome da roleta atual
let isSpinning = false;
let currentRotation = 0;
let currentTheme = 'classic';
const spinDuration = 11000; // Duração fixa do giro em ms


const colors = [
    '#ff0066', '#00ffff', '#ff3385', '#33ccff',
    '#ff0099', '#00cccc', '#ff1a75', '#1ac6ff',
    '#cc0052', '#0099cc', '#ff4d94', '#4dd4ff',
    '#990040', '#007399', '#ff66a3', '#66d9ff'
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinSound = document.getElementById('spinSound');

// Carregar dados do localStorage
function loadSettings() {
    const savedTheme = localStorage.getItem('animeWheelTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        currentTheme = savedTheme;
    }

    const noGlow = localStorage.getItem('noGlow') === 'true';
    if (noGlow) {
        document.body.classList.add('no-glow');
    }

    const savedWheels = localStorage.getItem('allWheels');
    if (savedWheels) {
        allWheels = JSON.parse(savedWheels);
    }

    const savedCurrentWheelId = localStorage.getItem('currentWheelId');
    if (savedCurrentWheelId && allWheels[savedCurrentWheelId]) {
        currentWheelId = savedCurrentWheelId;
        loadWheel(currentWheelId);
    } else if (Object.keys(allWheels).length > 0) {
        // Se o ID atual não for válido, carrega a primeira roleta salva
        currentWheelId = Object.keys(allWheels)[0];
        loadWheel(currentWheelId);
    } else {
        // Cria a roleta padrão se nenhuma existir
        currentWheelId = 'default';
        currentWheelName = 'Roleta Padrão';
        animes = [
            "bleach",
            "JoJo's Bizarre Adventure",
            "Solo Leveling",
            "Don't Toy with Me, Miss Nagatoro",
            "Banana Fish",
            "Sabikui Bisco",
            "Chainsaw Man",
            "Kakegurui",
            "Parasyte: The Maxim",
            "Tokyo Revengers",
            "Hajime no Ippo",
            "Baki",
            "Wonder Egg Priority",
            "Erased",
            "Blue Lock",
            "Bungou Stray Dogs",
            "Kaiju No. 8",
            "The Promised Neverland",
            "SPY×FAMILY",
            "The Founder of Diabolism",
            "Sonic X"
        ];
        animeImages = {};
        saveCurrentWheel(); // Salva a roleta padrão
    }
    
    // Atualiza o nome da roleta na interface
    const wheelNameElement = document.getElementById('wheelName');
    if (wheelNameElement) {
        wheelNameElement.textContent = currentWheelName;
    }
}

function saveAllWheels() {
    localStorage.setItem('allWheels', JSON.stringify(allWheels));
    localStorage.setItem('currentWheelId', currentWheelId);
}

function saveCurrentWheel() {
    allWheels[currentWheelId] = {
        id: currentWheelId,
        name: currentWheelName,
        animes: animes,

    };
    saveAllWheels();
}

function loadWheel(id) {
    const wheel = allWheels[id];
    if (wheel) {
        currentWheelId = id;
        currentWheelName = wheel.name;
        animes = wheel.animes;
        const wheelNameElement = document.getElementById('wheelName');
        if (wheelNameElement) {
            wheelNameElement.textContent = currentWheelName;
        }
        drawWheel();
        renderList();
        saveAllWheels(); // Atualiza o currentWheelId
        return true;
    }
    return false;
}

function createNewWheel(name) {
    const newId = Date.now().toString();
    currentWheelId = newId;
    currentWheelName = name;
    animes = [];
    saveCurrentWheel();
    drawWheel();
    renderList();
    const wheelNameElement = document.getElementById('wheelName');
    if (wheelNameElement) {
        wheelNameElement.textContent = currentWheelName;
    }
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

// Função auxiliar para obter todas as roletas
function getAllWheels() {
    return Object.values(allWheels);
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
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    updateActiveThemeButton(theme);
    drawWheel();
    localStorage.setItem('animeWheelTheme', theme);
}

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (animes.length === 0) {
        ctx.fillStyle = '#1a0033';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        return;
    }

    const anglePerSegment = (2 * Math.PI) / animes.length;

    animes.forEach((anime, index) => {
        const startAngle = index * anglePerSegment + currentRotation;
        const endAngle = startAngle + anglePerSegment;

        // Draw segment
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();



        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Orbitron';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(anime, radius - 20, 5);
        ctx.restore();
    });
}

function renderList() {
    const list = document.getElementById('animeList');
    list.innerHTML = '';
    
    animes.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'anime-item';
        item.innerHTML = `
            <span>${anime}</span>
            <button class="btn-remove" onclick="removeAnime(${index})">
                <svg class="remove-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        `;
        list.appendChild(item);
    });
}

function addAnime() {
    const input = document.getElementById('animeInput');
    const inputValue = input.value.trim();
    
    if (inputValue === '') {
        alert('Por favor, digite o nome de um anime!');
        return;
    }
    
    // Verificar se contém vírgula para adicionar múltiplos animes
    if (inputValue.includes(',')) {
        // Dividir por vírgula e limpar espaços
        const newAnimes = inputValue.split(',').map(anime => anime.trim()).filter(anime => anime !== '');
        
        let addedCount = 0;
        let duplicateCount = 0;
        
        newAnimes.forEach(anime => {
            if (animes.includes(anime)) {
                duplicateCount++;
            } else {
                animes.push(anime);
                addedCount++;
            }
        });
        
        if (addedCount === 0) {
            alert('Todos os animes digitados já estão na lista!');
        } else if (duplicateCount > 0) {
            alert(`${addedCount} anime(s) adicionado(s). ${duplicateCount} já estava(m) na lista.`);
        } else {
            alert(`${addedCount} anime(s) adicionado(s) com sucesso!`);
        }
    } else {
        // Adicionar um único anime
        if (animes.includes(inputValue)) {
            alert('Este anime já está na lista!');
            return;
        }
        animes.push(inputValue);
    }
    
    input.value = '';
    saveAnimes();
    drawWheel();
    renderList();
}

function removeAnime(index) {
    if (animes.length <= 2) {
        alert('A roleta precisa ter pelo menos 2 animes!');
        return;
    }
    
    animes.splice(index, 1);
    saveAnimes();
    drawWheel();
    renderList();
}

function clearAll() {
    if (confirm('Tem certeza que deseja limpar todos os animes?')) {
        animes = [];
        saveAnimes();
        drawWheel();
        renderList();
        document.getElementById('result').classList.remove('show');
    }
}

function saveAnimes() {
    saveCurrentWheel();
}

function spin() {
    if (isSpinning) return;
    
    if (animes.length === 0) {
        alert('Adicione pelo menos um anime para girar a roleta!');
        return;
    }
    
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('result').classList.remove('show');
    
    // Play sound
    spinSound.currentTime = 0;
    spinSound.play().catch(err => console.log('Erro ao reproduzir áudio:', err));
    
    const randomIndex = Math.floor(Math.random() * animes.length);
    const anglePerSegment = (2 * Math.PI) / animes.length;
    
    const minSpins = 5;
    const extraRotation = Math.random() * anglePerSegment * 0.8 - anglePerSegment * 0.4;
    
    const centerOfSegmentAngle = randomIndex * anglePerSegment + anglePerSegment / 2;
    let angleToAlignToTop = (2 * Math.PI) - centerOfSegmentAngle + (3 * Math.PI / 2);

    angleToAlignToTop = angleToAlignToTop % (2 * Math.PI);
    
    if (angleToAlignToTop < 0) {
        angleToAlignToTop += 2 * Math.PI;
    }
    
    const angleToStopAt = (2 * Math.PI) - centerOfSegmentAngle + (3 * Math.PI / 2);
    
    let angleDifference = (angleToStopAt % (2 * Math.PI)) - (currentRotation % (2 * Math.PI));
    
    if (angleDifference < 0) {
        angleDifference += 2 * Math.PI;
    }
    
    const targetAngle = currentRotation + (minSpins * 2 * Math.PI) + angleDifference + extraRotation;
    
    const duration = spinDuration;
    const startTime = Date.now();
    
    const startRotation = currentRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + (targetAngle - startRotation) * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinSound.pause();
            spinSound.currentTime = 0;
            
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            
            currentRotation = currentRotation % (2 * Math.PI);
            
            document.getElementById('resultText').textContent = animes[randomIndex];
            document.getElementById('result').classList.add('show');
        }
    }
    
    animate();
}

// Event listeners
document.getElementById('animeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addAnime();
    }
});

// Inicializar
loadSettings();
drawWheel();
renderList();

// Adicionar listener para garantir que o tema seja aplicado corretamente após o carregamento
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('animeWheelTheme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    const noGlow = localStorage.getItem('noGlow') === 'true';
    if (noGlow) {
        document.body.classList.add('no-glow');
    }
});


// Funções de Gerenciamento de Roletas (UI)
function openManageWheelsPopup() {
    document.getElementById('manageWheelsModal').style.display = 'flex';
    renderWheelList();
}

function closeManageWheelsPopup() {
    document.getElementById('manageWheelsModal').style.display = 'none';
}

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
                <button class="btn-icon-only" onclick="loadWheelAndClose('${wheel.id}')" title="Carregar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                </button>
                <button class="btn-icon-only btn-remove" onclick="deleteWheelAndClose('${wheel.id}')" title="Excluir">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

function loadWheelAndClose(id) {
    loadWheel(id);
    closeManageWheelsPopup();
}

function deleteWheelAndClose(id) {
    if (deleteWheel(id)) {
        renderWheelList();
    }
}

function promptNewWheel() {
    const newWheelNameInput = document.getElementById('newWheelName');
    const name = newWheelNameInput.value.trim();
    
    if (name === '') {
        alert('Por favor, insira um nome para a nova roleta.');
        return;
    }
    
    createNewWheel(name);
    newWheelNameInput.value = '';
    closeManageWheelsPopup();
}

// Alternância de Visualização
let isWheelView = true;

function toggleView() {
    isWheelView = !isWheelView;
    const wheelContainer = document.getElementById('wheelContainer');
    const listView = document.getElementById('listView');
    const spinBtn = document.getElementById('spinBtn');
    const result = document.getElementById('result');
    const toggleViewBtn = document.getElementById('toggleViewBtn');

    if (isWheelView) {
        // Mostrar roleta
        wheelContainer.style.display = 'block';
        spinBtn.style.display = 'flex';
        result.style.display = result.classList.contains('show') ? 'block' : 'none';
        listView.style.display = 'none';
        toggleViewBtn.style.opacity = '1';
    } else {
        // Mostrar lista
        wheelContainer.style.display = 'none';
        spinBtn.style.display = 'none';
        result.style.display = 'none';
        listView.style.display = 'block';
        toggleViewBtn.style.opacity = '0.6';
        renderListView();
    }
}

function renderListView() {
    const listViewContainer = document.getElementById('animeListView');
    listViewContainer.innerHTML = '';

    if (animes.length === 0) {
        listViewContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum anime adicionado</p>';
        return;
    }

    animes.forEach((anime, index) => {
        const item = document.createElement('div');
        item.className = 'anime-list-view-item';
        item.innerHTML = `
            <span class="anime-index">#${index + 1}</span>
            <span>${anime}</span>
        `;
        listViewContainer.appendChild(item);
    });
}

// Importar/Exportar
function openImportExportPopup() {
    document.getElementById('importExportModal').style.display = 'flex';
}

function closeImportExportPopup() {
    document.getElementById('importExportModal').style.display = 'none';
}

function exportAnimes() {
    const dataToExport = {
        animes: animes,
        theme: currentTheme,
        exportDate: new Date().toISOString()
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `animes_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Arquivo exportado com sucesso!');
    closeImportExportPopup();
}

function triggerImportFile() {
    document.getElementById('importFileInput').click();
}

function importAnimes(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.animes && Array.isArray(data.animes)) {
                // Verificar se o usuário quer substituir ou adicionar
                const confirmReplace = confirm('Deseja substituir a lista atual de animes ou adicionar os novos?\\n\\nClique "OK" para substituir ou "Cancelar" para adicionar.');
                
                if (confirmReplace) {
                    animes = data.animes;
                } else {
                    // Adicionar apenas os animes que não estão na lista
                    data.animes.forEach(anime => {
                        if (!animes.includes(anime)) {
                            animes.push(anime);
                        }
                    });
                }
                
                saveAnimes();
                drawWheel();
                renderList();
                if (!isWheelView) {
                    renderListView();
                }
                alert('Animes importados com sucesso!');
            } else {
                alert('Formato de arquivo inválido. O arquivo deve conter um array de animes.');
            }
        } catch (error) {
            alert('Erro ao importar arquivo: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Resetar o input para permitir importar o mesmo arquivo novamente
    event.target.value = '';
    closeImportExportPopup();
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
    const modal = document.getElementById('importExportModal');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal && event.target === modal) {
        closeImportExportPopup();
    }
});




function saveAnimes() {
    saveCurrentWheel();
}
