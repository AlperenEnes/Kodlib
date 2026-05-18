//#region Panel

// Panel açma işlemi tıklama dinleyicisi
document.querySelectorAll('.btn-panel').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPanelId = btn.getAttribute('data-target');
    togglePanel(targetPanelId);
  })
});


function togglePanel(panelId) {
  if(panelId==='') {// Panelleri gizle
    document.querySelectorAll('.panel.vis').forEach(p => p.classList.replace('vis', 'invis'));
    document.getElementById('shade').classList.replace('vis', 'invis');
  }
  else{// Hedef paneli göster
    document.getElementById(panelId).classList.replace('invis', 'vis');
    document.getElementById('shade').classList.replace('invis', 'vis');
  }
}
//#endregion

//#region Color and Theme
let currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex') || '0');
// Tema değiştirme işlemi tıklama dinleyicisi
const allThemes =[
  {
    name: "dark",
    colors: {
    '--font-color': '#ffffff',
    '--primary-color': '#252526',
    '--secondary-color': '#333333',
    '--highlight-color': '#0ea5e9'
    }
  },
  {
    name: "light",
    colors: {
    '--font-color': '#000000',
    '--primary-color': '#f5f5f5',
    '--secondary-color': '#e0e0e0',
    '--highlight-color': '#0ea5e9'
    }
  }
]

// Temaların localStorage'da olup olmadığını kontrol et ve yoksa ekle

if(!localStorage.getItem('themes')){
  localStorage.setItem('themes', JSON.stringify(allThemes));
  console.log('Default themes are saved to the localStorage.');
}
else{console.log('Themes already exist in the localStorage.');}

function resetThemes(){
  localStorage.setItem('themes', JSON.stringify(allThemes));
}

function updateColorSwatches(colors) {
  document.querySelectorAll('.color-swatch').forEach(swatch => {
    const colorVar = swatch.getAttribute('data-color');
    if (colors[colorVar]) {
      swatch.style.backgroundColor = colors[colorVar];
      swatch.querySelector('input[type="color"]').value = colors[colorVar];
    }
  });
}

function applyTheme(colors) {
  for (const [varName, color] of Object.entries(colors)) {
    document.documentElement.style.setProperty(varName, color);
  }
}

function swapThemeIcon(current, next){
  document.getElementById(`theme${current}`).classList.replace('vis', 'invis');
  document.getElementById(`theme${next}`).classList.replace('invis', 'vis');
}

function themeToggle() {
  const themes = JSON.parse(localStorage.getItem('themes')) || allThemes;
  const currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex') || '0');
  const nextThemeIndex = (currentThemeIndex + 1) % themes.length;

  swapThemeIcon(currentThemeIndex, nextThemeIndex);

  localStorage.setItem('currentThemeIndex', nextThemeIndex);
  const selectedTheme = themes[nextThemeIndex];
  document.documentElement.classList.toggle('light-theme', selectedTheme.name === 'light');
  return selectedTheme.colors;
}

function pushCustomTheme(colors) {
  const customTheme = {
    name: 'custom',
    colors: colors
  };
  const themes = JSON.parse(localStorage.getItem('themes')) || [];
  if(themes.length >= 3){
    themes.pop();
  }
  themes.push(customTheme);
  localStorage.setItem('themes', JSON.stringify(themes));
}

document.querySelectorAll('.color-swatch').forEach(swatch => {
  // Renk paleti açma işlemi
  swatch.addEventListener('click', () => {
    swatch.querySelector('input[type="color"]').click();
  });
  
  // Rengi temaya uygulama işlemi
  swatch.querySelector('input[type="color"]').addEventListener('input', (e) => {
    const colorVar = swatch.getAttribute('data-color');
    const hexColor = e.target.value;
    applyTheme({ [colorVar]: hexColor });
    swatch.style.backgroundColor = hexColor;
  });
});

function btnResetTheme(){
  resetThemes();
  updateColorSwatches(allThemes[0].colors);
  applyTheme(allThemes[0].colors);
};

function btnThemeToggle(){
  const colors = themeToggle();
  applyTheme(colors);
  updateColorSwatches(colors);
};

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const themes = JSON.parse(localStorage.getItem('themes')) || allThemes;
  const currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex') || '0');
  const selectedTheme = themes[currentThemeIndex] || allThemes[0];

  swapThemeIcon(0, currentThemeIndex);
  document.documentElement.classList.toggle('light-theme', selectedTheme.name === 'light');
  applyTheme(selectedTheme.colors);
  updateColorSwatches(selectedTheme.colors);
});

function btnApplyColors() {
  const currentThemeIndex = parseInt(localStorage.getItem('currentThemeIndex') || '0');
  const themes = JSON.parse(localStorage.getItem('themes')) || allThemes;
  const currentTheme = (themes[currentThemeIndex] && themes[currentThemeIndex].colors) || allThemes[0].colors;
  const getColor = (varName) => {
    const input = document.querySelector(`.color-swatch[data-color="${varName}"] input[type="color"]`);
    return (input && input.value) ? input.value : currentTheme[varName];
  };

  const customColors = {
    '--primary-color': getColor('--primary-color'),
    '--secondary-color': getColor('--secondary-color'),
    '--highlight-color': getColor('--highlight-color'),
    '--font-color': getColor('--font-color')
  };

  updateColorSwatches(customColors);
  pushCustomTheme(customColors);
  applyTheme(customColors);
};
//#endregion

//#region Copy Snippet
const copyBtn = document.getElementById('btn-copy');
if (copyBtn) {
  copyBtn.addEventListener('click', function(e) {
    const codeEl = this.parentElement.querySelector('code');
    if (!codeEl) return;
    const code = codeEl.innerText.trim();
    if (code) {
      console.log(code,"\nCode snippet has been succesfully copied!");
    }
    navigator.clipboard.writeText(code).then(() => {
      const currentColor = this.style.color;
      this.style.color = 'var(--highlight-color)';
      setTimeout(() => {
        this.style.color = currentColor;
      }, 1000);
    });
  });
}
// #endregion

//#region Misc
function toggleList(){
  document.getElementById("menu").classList.toggle("menu-collapsed");
}
// #endregion

//#region Profile
// Called by the Firebase onAuthStateChanged listener in index.html
function showLoggedIn(user) {
  document.getElementById('profile-logged-out').classList.add('invis');
  document.getElementById('profile-logged-in').classList.remove('invis');
  document.getElementById('profile-logged-in').classList.add('vis');
  if (user.name)  document.getElementById('profile-username').textContent = user.name;
  if (user.email) document.getElementById('profile-email').textContent = user.email;
  if (user.avatar) {
    const avatar = document.getElementById('profile-avatar');
    avatar.innerHTML = `<img src="${user.avatar}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
  }
}

function showLoggedOut() {
  document.getElementById('profile-logged-in').classList.remove('vis');
  document.getElementById('profile-logged-in').classList.add('invis');
  document.getElementById('profile-logged-out').classList.remove('invis');
  // Reset avatar back to the default SVG icon
  document.getElementById('profile-avatar').innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c3.662 0 6.865 1.575 8.607 3.925l-1.842.871C17.347 20.116 14.847 19 12 19c-2.847 0-5.347 1.116-6.765 2.796l-1.841-.872C5.136 18.575 8.338 17 12 17zm0-15c2.761 0 5 2.239 5 5v3c0 2.761-2.239 5-5 5s-5-2.239-5-5V7c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3v3c0 1.657 1.343 3 3 3s3-1.343 3-3V7c0-1.657-1.343-3-3-3z"/></svg>`;
}

// btnLoginGoogle, btnLoginGithub and btnLogout are defined in the Firebase module (index.html)
// and exposed via window.btnLoginGoogle, window.btnLoginGithub, window.btnLogout
//#endregion

//#region Snippets & Local Storage

const seedSnippets = [
  {
    id: "seed-csharp-bubble-sort",
    title: "Bubble Sort",
    description: "C# ile klasik kabarcık sıralama algoritması uygulaması.",
    code: `using System;

class Program {
    static void BubbleSort(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    static void Main() {
        int[] arr = { 64, 34, 25, 12, 22, 11, 90 };
        BubbleSort(arr);
        Console.WriteLine("Sıralı dizi:");
        Console.WriteLine(string.Join(", ", arr));
    }
}`,
    language: "csharp",
    favorite: false,
    createdByUser: false
  },
  {
    id: "seed-javascript-debounce",
    title: "Debounce Function",
    description: "JavaScript high-performance event rate limiter.",
    code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
    language: "javascript",
    favorite: false,
    createdByUser: false
  }
];

// Active filter states
let currentFilter = 'all'; // 'all', 'favorites', 'own'
let currentSearch = '';

function getSnippets() {
  const data = localStorage.getItem('snippets');
  if (!data) {
    localStorage.setItem('snippets', JSON.stringify(seedSnippets));
    return seedSnippets;
  }
  return JSON.parse(data);
}

function saveSnippets(snippets) {
  localStorage.setItem('snippets', JSON.stringify(snippets));
  updateStats();
}

function updateStats() {
  const snippets = getSnippets();
  const totalCount = snippets.length;
  const favCount = snippets.filter(s => s.favorite).length;

  const statSnippetsEl = document.getElementById('stat-snippets');
  const statFavoritesEl = document.getElementById('stat-favorites');

  if (statSnippetsEl) statSnippetsEl.textContent = totalCount;
  if (statFavoritesEl) statFavoritesEl.textContent = favCount;
}

function renderSnippetList() {
  const snippets = getSnippets();
  const listEl = document.querySelector('.list');
  if (!listEl) return;

  listEl.innerHTML = '';

  // Filter snippets
  let filtered = snippets;

  if (currentFilter === 'favorites') {
    filtered = filtered.filter(s => s.favorite);
  } else if (currentFilter === 'own') {
    filtered = filtered.filter(s => s.createdByUser);
  } else if (currentFilter === 'history') {
    const historyIds = JSON.parse(localStorage.getItem('history') || '[]');
    filtered = historyIds
      .map(hid => snippets.find(s => s.id === hid))
      .filter(s => s !== undefined);
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase();
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(q) || 
      (s.description && s.description.toLowerCase().includes(q)) ||
      s.code.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `<li style="pointer-events: none; opacity: 0.6; font-style: italic; justify-content: center;">Kod bulunamadı</li>`;
    return;
  }

  const activeId = localStorage.getItem('activeSnippetId');

  filtered.forEach(snippet => {
    const li = document.createElement('li');
    li.textContent = snippet.title;
    li.setAttribute('data-id', snippet.id);
    
    // Highlight if active
    if (snippet.id === activeId) {
      li.style.borderLeftColor = 'var(--highlight-color)';
      li.style.backgroundColor = 'var(--primary-color)';
      li.style.paddingLeft = '28px';
    }

    li.addEventListener('click', () => {
      viewSnippet(snippet.id);
    });

    listEl.appendChild(li);
  });
}

function addToHistory(id) {
  let history = JSON.parse(localStorage.getItem('history') || '[]');
  history = history.filter(itemId => itemId !== id);
  history.unshift(id);
  if (history.length > 50) {
    history.pop();
  }
  localStorage.setItem('history', JSON.stringify(history));
}

function viewSnippet(id) {
  const snippets = getSnippets();
  const snippet = snippets.find(s => s.id === id);
  if (!snippet) return;

  localStorage.setItem('activeSnippetId', id);
  addToHistory(id);

  // Update content panel
  const titleEl = document.querySelector('#head h1');
  const descEl = document.querySelector('#description p');
  const codeEl = document.querySelector('#example pre code');
  const favoriteStar = document.querySelector('#head svg');

  if (titleEl) titleEl.textContent = snippet.title;
  if (descEl) descEl.textContent = snippet.description || '';
  
  if (codeEl) {
    codeEl.className = '';
    codeEl.classList.add(`language-${snippet.language}`, 'code');
    codeEl.textContent = snippet.code;
    
    if (window.Prism) {
      Prism.highlightElement(codeEl);
    }
  }

  // Update favorite star visual status
  if (favoriteStar) {
    if (snippet.favorite) {
      favoriteStar.setAttribute('fill', 'var(--highlight-color)');
      favoriteStar.style.stroke = 'var(--highlight-color)';
    } else {
      favoriteStar.setAttribute('fill', 'none');
      favoriteStar.style.stroke = 'currentColor';
    }
  }

  // Refresh active state in list
  document.querySelectorAll('.list > li').forEach(li => {
    const liId = li.getAttribute('data-id');
    if (liId === id) {
      li.style.borderLeftColor = 'var(--highlight-color)';
      li.style.backgroundColor = 'var(--primary-color)';
      li.style.paddingLeft = '28px';
    } else {
      li.style.borderLeftColor = 'transparent';
      li.style.backgroundColor = 'transparent';
      li.style.paddingLeft = '24px';
    }
  });

  // Show snippet action buttons if user-created
  const actionsEl = document.getElementById('snippet-actions');
  if (actionsEl) {
    if (snippet.createdByUser) {
      actionsEl.classList.replace('invis', 'vis');
    } else {
      actionsEl.classList.replace('vis', 'invis');
    }
  }
}

function toggleFavoriteActive() {
  const activeId = localStorage.getItem('activeSnippetId');
  if (!activeId) return;

  const snippets = getSnippets();
  const snippet = snippets.find(s => s.id === activeId);
  if (!snippet) return;

  snippet.favorite = !snippet.favorite;
  saveSnippets(snippets);
  
  // Update star visual
  const favoriteStar = document.querySelector('#head svg');
  if (favoriteStar) {
    if (snippet.favorite) {
      favoriteStar.setAttribute('fill', 'var(--highlight-color)');
      favoriteStar.style.stroke = 'var(--highlight-color)';
    } else {
      favoriteStar.setAttribute('fill', 'none');
      favoriteStar.style.stroke = 'currentColor';
    }
  }

  if (currentFilter === 'favorites') {
    renderSnippetList();
  }
}

// Add event listener for Create Snippet button inside modal
document.getElementById('create-snippet-btn').addEventListener('click', () => {
  const title = document.getElementById('new-snippet-title').value.trim();
  const description = document.getElementById('new-snippet-description').value.trim();
  const language = document.getElementById('new-snippet-language').value;
  const code = document.getElementById('new-snippet-code').value.trim();

  if (!title) {
    alert('Lütfen bir başlık girin!');
    return;
  }
  if (!code) {
    alert('Lütfen kod içeriğini girin!');
    return;
  }

  const newSnippet = {
    id: Date.now().toString(),
    title: title,
    description: description,
    language: language,
    code: code,
    favorite: false,
    createdByUser: true
  };

  const snippets = getSnippets();
  snippets.push(newSnippet);
  saveSnippets(snippets);

  // Clear inputs
  document.getElementById('new-snippet-title').value = '';
  document.getElementById('new-snippet-description').value = '';
  document.getElementById('new-snippet-language').value = 'csharp';
  document.getElementById('new-snippet-code').value = '';

  // Close modal
  togglePanel('');

  // Re-render and select the newly created snippet
  renderSnippetList();
  viewSnippet(newSnippet.id);
});

// Setup Left sidebar category filtering
document.querySelectorAll('.categories .svg').forEach(cat => {
  cat.addEventListener('click', () => {
    if (cat.classList.contains('all-codes')) {
      currentFilter = 'all';
      renderSnippetList();
    } else if (cat.classList.contains('favorites')) {
      currentFilter = 'favorites';
      renderSnippetList();
    } else if (cat.classList.contains('own-codes')) {
      currentFilter = 'own';
      renderSnippetList();
    } else if (cat.classList.contains('history')) {
      currentFilter = 'history';
      renderSnippetList();
    }
  });
});

// Setup search bar filtering
document.querySelector('.searchbar').addEventListener('input', (e) => {
  currentSearch = e.target.value;
  renderSnippetList();
});

// Setup favorite star toggle click listener
const starEl = document.querySelector('#head svg');
if (starEl) {
  starEl.style.cursor = 'pointer';
  starEl.addEventListener('click', toggleFavoriteActive);
}

// Setup Share / Publish button click listener
const publishBtn = document.getElementById('btn-publish');
if (publishBtn) {
  publishBtn.addEventListener('click', () => {
    const activeId = localStorage.getItem('activeSnippetId');
    if (!activeId) return;

    const snippets = getSnippets();
    const snippet = snippets.find(s => s.id === activeId);
    if (!snippet) return;

    // Check if user is logged in
    const isLoggedIn = document.getElementById('profile-logged-in') && !document.getElementById('profile-logged-in').classList.contains('invis');
    if (!isLoggedIn) {
      alert('Kodlarınızı yayınlayabilmek için lütfen önce Profil sekmesinden giriş yapın!');
      return;
    }

    alert(`'${snippet.title}' kodunuz başarıyla paylaşıldı ve Kodlib bulutuna yüklendi!`);
  });
}

// Setup Delete button click listener
const deleteBtn = document.getElementById('btn-delete');
if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    const activeId = localStorage.getItem('activeSnippetId');
    if (!activeId) return;

    const snippets = getSnippets();
    const snippet = snippets.find(s => s.id === activeId);
    if (!snippet) return;

    const confirmDelete = confirm(`"${snippet.title}" kodunu kalıcı olarak silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    const updatedSnippets = snippets.filter(s => s.id !== activeId);
    saveSnippets(updatedSnippets);

    let nextActiveId = null;
    if (updatedSnippets.length > 0) {
      nextActiveId = updatedSnippets[0].id;
      localStorage.setItem('activeSnippetId', nextActiveId);
    } else {
      localStorage.removeItem('activeSnippetId');
    }

    renderSnippetList();
    
    if (nextActiveId) {
      viewSnippet(nextActiveId);
    } else {
      // Clear view
      const titleEl = document.querySelector('#head h1');
      const descEl = document.querySelector('#description p');
      const codeEl = document.querySelector('#example pre code');
      if (titleEl) titleEl.textContent = 'Kodlib';
      if (descEl) descEl.textContent = 'Henüz hiçbir kod eklenmemiş. Yeni kod oluşturmak için soldaki artı butonuna basabilirsiniz.';
      if (codeEl) {
        codeEl.className = 'code';
        codeEl.textContent = '';
      }
      const actionsEl = document.getElementById('snippet-actions');
      if (actionsEl) {
        actionsEl.classList.replace('vis', 'invis');
      }
    }
  });
}

// Initialize Snippet app on DOM load
window.addEventListener('DOMContentLoaded', () => {
  const snippets = getSnippets();
  
  let activeId = localStorage.getItem('activeSnippetId');
  if (!activeId && snippets.length > 0) {
    activeId = snippets[0].id;
    localStorage.setItem('activeSnippetId', activeId);
  }

  renderSnippetList();
  updateStats();
  if (activeId) {
    viewSnippet(activeId);
  }
});

//#endregion
