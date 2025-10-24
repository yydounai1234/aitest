let characters = [];
let scenes = [];
let isPlaying = false;
let currentScene = 0;

const novelTextEl = document.getElementById('novelText');
const styleSelectEl = document.getElementById('styleSelect');
const voiceSelectEl = document.getElementById('voiceSelect');
const bgmSelectEl = document.getElementById('bgmSelect');
const bgmVolumeEl = document.getElementById('bgmVolume');
const volumeValueEl = document.getElementById('volumeValue');
const characterListEl = document.getElementById('characterList');
const addCharacterBtnEl = document.getElementById('addCharacterBtn');
const generateBtnEl = document.getElementById('generateBtn');
const clearBtnEl = document.getElementById('clearBtn');
const loadSampleBtnEl = document.getElementById('loadSampleBtn');
const previewSectionEl = document.getElementById('previewSection');
const animeContentEl = document.getElementById('animeContent');
const progressFillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');
const playBtnEl = document.getElementById('playBtn');
const pauseBtnEl = document.getElementById('pauseBtn');
const exportBtnEl = document.getElementById('exportBtn');
const characterModalEl = document.getElementById('characterModal');
const characterFormEl = document.getElementById('characterForm');
const closeModalEl = document.querySelector('.close');

bgmVolumeEl.addEventListener('input', (e) => {
    volumeValueEl.textContent = `${e.target.value}%`;
});

clearBtnEl.addEventListener('click', () => {
    if (confirm('确定要清空所有内容吗？')) {
        novelTextEl.value = '';
        characters = [];
        scenes = [];
        renderCharacterList();
        previewSectionEl.style.display = 'none';
    }
});

loadSampleBtnEl.addEventListener('click', () => {
    novelTextEl.value = `在一个宁静的小镇上，住着一位名叫艾莉的年轻女孩。她有着一头金色的长发和碧蓝的眼睛，总是穿着一条白色的连衣裙。艾莉最喜欢做的事情就是在镇外的森林里探险。

有一天，艾莉在森林深处发现了一扇古老的石门。门上刻着神秘的符文，散发着微弱的蓝光。她好奇地推开了石门，里面是一个充满奇幻生物的世界。

突然，一只会说话的白兔出现在她面前。"欢迎来到魔法世界，"白兔说道，"我叫雷克斯，很高兴认识你。"雷克斯有着红宝石般的眼睛和柔软的白色皮毛。

艾莉和雷克斯成为了好朋友，他们一起开始了一段神奇的冒险之旅。`;
    
    characters = [
        {
            name: '艾莉',
            description: '金色长发、碧蓝眼睛、白色连衣裙',
            personality: '好奇、勇敢、善良'
        },
        {
            name: '雷克斯',
            description: '白色皮毛、红宝石般的眼睛、会说话的兔子',
            personality: '友善、聪明、幽默'
        }
    ];
    
    renderCharacterList();
});

addCharacterBtnEl.addEventListener('click', () => {
    characterModalEl.style.display = 'block';
});

closeModalEl.addEventListener('click', () => {
    characterModalEl.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === characterModalEl) {
        characterModalEl.style.display = 'none';
    }
});

characterFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const charName = document.getElementById('charName').value;
    const charDesc = document.getElementById('charDesc').value;
    const charPersonality = document.getElementById('charPersonality').value;
    
    characters.push({
        name: charName,
        description: charDesc,
        personality: charPersonality
    });
    
    renderCharacterList();
    characterModalEl.style.display = 'none';
    characterFormEl.reset();
});

function renderCharacterList() {
    if (characters.length === 0) {
        characterListEl.innerHTML = '<div class="empty-state">暂无角色，系统将自动识别文本中的角色</div>';
        return;
    }
    
    characterListEl.innerHTML = characters.map((char, index) => `
        <div class="character-card">
            <h4>${char.name}</h4>
            <p><strong>外貌：</strong>${char.description}</p>
            <p><strong>性格：</strong>${char.personality}</p>
            <button onclick="deleteCharacter(${index})">删除</button>
        </div>
    `).join('');
}

function deleteCharacter(index) {
    if (confirm(`确定要删除角色"${characters[index].name}"吗？`)) {
        characters.splice(index, 1);
        renderCharacterList();
    }
}

generateBtnEl.addEventListener('click', async () => {
    const text = novelTextEl.value.trim();
    
    if (!text) {
        alert('请先输入小说文本！');
        return;
    }
    
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length === 0) {
        alert('请输入有效的文本内容！');
        return;
    }
    
    generateBtnEl.disabled = true;
    generateBtnEl.textContent = '⏳ 生成中...';
    previewSectionEl.style.display = 'block';
    animeContentEl.innerHTML = '';
    
    scenes = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
        const progress = ((i + 1) / paragraphs.length) * 100;
        progressFillEl.style.width = `${progress}%`;
        progressTextEl.textContent = `正在生成第 ${i + 1}/${paragraphs.length} 个场景...`;
        
        await simulateSceneGeneration(paragraphs[i], i + 1);
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    generateBtnEl.disabled = false;
    generateBtnEl.textContent = '🎨 开始生成动漫';
    progressTextEl.textContent = '✅ 生成完成！';
    
    previewSectionEl.scrollIntoView({ behavior: 'smooth' });
});

async function simulateSceneGeneration(text, sceneNumber) {
    const style = styleSelectEl.value;
    const voice = voiceSelectEl.value;
    
    const scene = {
        number: sceneNumber,
        text: text,
        style: style,
        voice: voice,
        imageUrl: generatePlaceholderImage(style, sceneNumber)
    };
    
    scenes.push(scene);
    renderScene(scene);
}

function generatePlaceholderImage(style, sceneNumber) {
    const styleNames = {
        'anime': '日式动漫',
        'manga': '漫画风格',
        'realistic': '写实风格',
        'chibi': 'Q版可爱',
        'watercolor': '水彩画风'
    };
    
    return `https://via.placeholder.com/800x400/667eea/ffffff?text=${encodeURIComponent(styleNames[style] + ' - 场景' + sceneNumber)}`;
}

function renderScene(scene) {
    const sceneEl = document.createElement('div');
    sceneEl.className = 'scene-card';
    sceneEl.id = `scene-${scene.number}`;
    
    sceneEl.innerHTML = `
        <h3>场景 ${scene.number}</h3>
        <div class="scene-image">
            <img src="${scene.imageUrl}" alt="场景${scene.number}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                 onerror="this.parentElement.innerHTML='🎨 AI生成图片（${scene.style}）'">
        </div>
        <div class="scene-text">${scene.text}</div>
        <div class="scene-audio">
            🎤 配音：${getVoiceName(scene.voice)} | 🎵 背景音乐：${bgmSelectEl.options[bgmSelectEl.selectedIndex].text}
        </div>
    `;
    
    animeContentEl.appendChild(sceneEl);
}

function getVoiceName(voiceType) {
    const voices = {
        'male1': '男声1 - 沉稳',
        'male2': '男声2 - 年轻',
        'female1': '女声1 - 温柔',
        'female2': '女声2 - 活泼',
        'narrator': '旁白 - 专业'
    };
    return voices[voiceType] || voiceType;
}

playBtnEl.addEventListener('click', () => {
    if (scenes.length === 0) {
        alert('请先生成动漫内容！');
        return;
    }
    
    isPlaying = true;
    playBtnEl.disabled = true;
    pauseBtnEl.disabled = false;
    
    playScenes();
});

pauseBtnEl.addEventListener('click', () => {
    isPlaying = false;
    playBtnEl.disabled = false;
    pauseBtnEl.disabled = true;
});

async function playScenes() {
    for (let i = currentScene; i < scenes.length && isPlaying; i++) {
        const sceneEl = document.getElementById(`scene-${i + 1}`);
        
        document.querySelectorAll('.scene-card').forEach(el => {
            el.style.border = 'none';
            el.style.borderLeft = '4px solid #667eea';
        });
        
        sceneEl.style.border = '3px solid #667eea';
        sceneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        progressTextEl.textContent = `正在播放场景 ${i + 1}/${scenes.length}`;
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        currentScene = i + 1;
    }
    
    if (currentScene >= scenes.length) {
        currentScene = 0;
        progressTextEl.textContent = '✅ 播放完成！';
    }
    
    isPlaying = false;
    playBtnEl.disabled = false;
    pauseBtnEl.disabled = true;
}

exportBtnEl.addEventListener('click', () => {
    if (scenes.length === 0) {
        alert('请先生成动漫内容！');
        return;
    }
    
    const exportData = {
        title: '智能生成的动漫作品',
        createdAt: new Date().toISOString(),
        settings: {
            style: styleSelectEl.options[styleSelectEl.selectedIndex].text,
            voice: voiceSelectEl.options[voiceSelectEl.selectedIndex].text,
            bgm: bgmSelectEl.options[bgmSelectEl.selectedIndex].text,
            volume: bgmVolumeEl.value
        },
        characters: characters,
        scenes: scenes
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `anime-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('✅ 导出成功！作品已保存为JSON格式，可用于后续编辑和分享。');
});

window.deleteCharacter = deleteCharacter;
