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
document.getElementById('btn-copy').addEventListener('click', function(e) {
    const code = this.parentElement.querySelector('code').innerText.trim();
    // Find the code block sitting right next to/under this button
    if (code) {
    console.log(code,"\nCode snippet has been succesfully copied!");}
    navigator.clipboard.writeText(code).then(() => {
      const currentColor = this.style.color;
      this.style.color = 'var(--highlight-color)';
      setTimeout(() => {
        this.style.color = currentColor;
      }, 1000);});
});
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
