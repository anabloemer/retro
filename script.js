const pages = {
  home: "Início",
  avatar: "Meu avatar",
  room: "Meu quarto",
  arcade: "Fliperama",
};

const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function navigate(page) {
  if (!pages[page]) return;
  document.querySelectorAll(".page-section").forEach((section) => section.classList.remove("active"));
  document.querySelector(`#page-${page}`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.page === page));
  document.querySelector("#current-crumb").textContent = pages[page];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach((element) => {
  element.addEventListener("click", () => navigate(element.dataset.page));
});

let coins = Number(localStorage.getItem("pixel-world-coins")) || 2450;
const coinDisplay = document.querySelector("#coin-count");
const formatCoins = (value) => new Intl.NumberFormat("pt-BR").format(value);

function updateCoins() {
  coinDisplay.textContent = formatCoins(coins);
  localStorage.setItem("pixel-world-coins", String(coins));
}

const savedName = localStorage.getItem("pixel-world-name") || "Luna";
document.querySelector("#name-input").value = savedName;

function updateName(name) {
  document.querySelector("#display-name").textContent = name;
  document.querySelector("#display-name-sidebar").textContent = name;
  document.querySelector("#display-name-top").textContent = name;
  document.querySelector("#display-name-avatar").textContent = name.toLocaleUpperCase();
  document.querySelector("#display-name-room").textContent = name.toLocaleUpperCase();
  document.querySelector(".mini-avatar").textContent = name.charAt(0).toLocaleUpperCase();
  document.querySelector(".top-avatar").textContent = name.charAt(0).toLocaleUpperCase();
}

updateName(savedName);
document.querySelector("#name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#name-input").value.trim();
  if (!name) {
    showToast("Escreva um nome para personalizar seu cantinho.");
    document.querySelector("#name-input").focus();
    return;
  }
  localStorage.setItem("pixel-world-name", name);
  updateName(name);
  showToast(`Oi, ${name}! Seu cantinho está com a sua cara ✨`);
});

const avatarDefaults = {
  skin: "#f5c99e",
  hairColor: "#573b52",
  hairStyle: "curto",
  shirt: "#8b78df",
  bottom: "#6b6199",
  accessory: "✦",
  outfit: "camiseta",
};
let avatar = { ...avatarDefaults, ...JSON.parse(localStorage.getItem("pixel-world-avatar") || "{}") };

function paintAvatar(saved = false) {
  document.querySelector("#avatar-face").style.backgroundColor = avatar.skin;
  document.querySelector(".avatar-neck").style.backgroundColor = avatar.skin;
  document.querySelector(".avatar-arms").style.backgroundColor = avatar.skin;
  document.querySelector("#avatar-hair").style.backgroundColor = avatar.hairColor;
  document.querySelector("#avatar-shirt").style.backgroundColor = avatar.shirt;
  document.querySelector("#avatar-shirt").dataset.outfit = avatar.outfit;
  document.querySelector("#avatar-bottom").style.backgroundColor = avatar.bottom;
  document.querySelector("#avatar-accessory").textContent = avatar.accessory;
  document.querySelector("#avatar-hair").dataset.style = avatar.hairStyle;
  document.querySelectorAll(".swatch").forEach((swatch) => {
    const active = swatch.dataset.skin === avatar.skin
      || swatch.dataset.hairColor === avatar.hairColor
      || swatch.dataset.shirt === avatar.shirt
      || swatch.dataset.bottom === avatar.bottom;
    if (active) swatch.classList.add("selected");
    else if (swatch.matches(".skin-swatches *, .hair-swatches *, .clothes-swatches *")) swatch.classList.remove("selected");
  });
  document.querySelectorAll("[data-hair]").forEach((button) => button.classList.toggle("selected", button.dataset.hair === avatar.hairStyle));
  document.querySelectorAll("[data-accessory]").forEach((button) => button.classList.toggle("selected", button.dataset.accessory === avatar.accessory));
  document.querySelectorAll("[data-outfit]").forEach((button) => button.classList.toggle("selected", button.dataset.outfit === avatar.outfit));
  document.querySelector("#avatar-saved").textContent = saved ? "✦ Mudanças salvas" : "✦ Salve para guardar seu novo visual";
}

document.querySelectorAll("[data-skin]").forEach((button) => button.addEventListener("click", () => {
  avatar.skin = button.dataset.skin;
  paintAvatar();
}));
document.querySelectorAll("[data-hair-color]").forEach((button) => button.addEventListener("click", () => {
  avatar.hairColor = button.dataset.hairColor;
  paintAvatar();
}));
document.querySelectorAll("[data-shirt]").forEach((button) => button.addEventListener("click", () => {
  avatar.shirt = button.dataset.shirt;
  paintAvatar();
}));
document.querySelectorAll("[data-bottom]").forEach((button) => button.addEventListener("click", () => {
  avatar.bottom = button.dataset.bottom;
  paintAvatar();
}));
document.querySelectorAll("[data-outfit]").forEach((button) => button.addEventListener("click", () => {
  avatar.outfit = button.dataset.outfit;
  paintAvatar();
}));
document.querySelectorAll("[data-hair]").forEach((button) => button.addEventListener("click", () => {
  avatar.hairStyle = button.dataset.hair;
  paintAvatar();
}));
document.querySelectorAll("[data-accessory]").forEach((button) => button.addEventListener("click", () => {
  avatar.accessory = button.dataset.accessory;
  paintAvatar();
}));
document.querySelector("#save-avatar").addEventListener("click", () => {
  localStorage.setItem("pixel-world-avatar", JSON.stringify(avatar));
  paintAvatar(true);
  showToast("Avatar salvo! Esse look é a sua cara ✨");
});

paintAvatar(true);

let savedFurniture = JSON.parse(localStorage.getItem("pixel-world-furniture") || "[]");
savedFurniture.forEach((item) => {
  const button = document.querySelector(`[data-furniture="${item}"]`);
  if (!button) return;
  button.dataset.added = "true";
  button.querySelector("b").textContent = "✓";
  document.querySelector("#room-scene").classList.add(`has-${item}`);
});

document.querySelectorAll("[data-furniture]").forEach((button) => button.addEventListener("click", () => {
  const costs = { plant: 80, lamp: 120, rug: 60 };
  const names = { plant: "Plantinha feliz", lamp: "Luz de estrelinha", rug: "Tapete fofinho" };
  const item = button.dataset.furniture;
  if (button.dataset.added === "true") {
    showToast(`${names[item]} já está no seu quarto! ♡`);
    return;
  }
  if (coins < costs[item]) {
    showToast("Você não tem coins suficientes para esse item.");
    return;
  }
  coins -= costs[item];
  button.dataset.added = "true";
  document.querySelector("#room-scene").classList.add(`has-${item}`);
  savedFurniture.push(item);
  localStorage.setItem("pixel-world-furniture", JSON.stringify(savedFurniture));
  button.querySelector("b").textContent = "✓";
  updateCoins();
  showToast(`${names[item]} adicionada ao quarto por ${costs[item]} coins!`);
}));

document.querySelector("#room-reset").addEventListener("click", () => {
  document.querySelector("#room-scene").classList.remove("has-plant", "has-lamp", "has-rug");
  savedFurniture = [];
  localStorage.setItem("pixel-world-furniture", JSON.stringify(savedFurniture));
  localStorage.removeItem("pixel-world-room-layout");
  document.querySelectorAll("[data-movable]").forEach((item) => {
    item.style.left = "";
    item.style.top = "";
    item.style.right = "";
    item.style.bottom = "";
  });
  document.querySelector("#room-scene").dataset.theme = "pink";
  localStorage.setItem("pixel-world-room-theme", "pink");
  document.querySelectorAll("[data-room-theme]").forEach((button) => button.classList.toggle("selected", button.dataset.roomTheme === "pink"));
  document.querySelectorAll("[data-furniture]").forEach((button) => {
    delete button.dataset.added;
    button.querySelector("b").textContent = "+";
  });
  showToast("Quarto reorganizado! A paleta voltou ao rosa retrô.");
});

const roomScene = document.querySelector("#room-scene");
const roomTheme = localStorage.getItem("pixel-world-room-theme") || "pink";
roomScene.dataset.theme = roomTheme;
document.querySelectorAll("[data-room-theme]").forEach((button) => {
  button.classList.toggle("selected", button.dataset.roomTheme === roomTheme);
  button.addEventListener("click", () => {
    roomScene.dataset.theme = button.dataset.roomTheme;
    localStorage.setItem("pixel-world-room-theme", button.dataset.roomTheme);
    document.querySelectorAll("[data-room-theme]").forEach((option) => option.classList.toggle("selected", option === button));
  });
});

let roomLayout = JSON.parse(localStorage.getItem("pixel-world-room-layout") || "{}");
document.querySelectorAll("[data-movable]").forEach((item) => {
  const position = roomLayout[item.dataset.piece];
  if (!position) return;
  item.style.left = `${position.left}%`;
  item.style.top = `${position.top}%`;
  item.style.right = "auto";
  item.style.bottom = "auto";
});

document.querySelectorAll("[data-movable]").forEach((item) => {
  let grabOffsetX = 0;
  let grabOffsetY = 0;
  let parentBounds;

  item.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    parentBounds = item.parentElement.getBoundingClientRect();
    const itemBounds = item.getBoundingClientRect();
    grabOffsetX = event.clientX - itemBounds.left;
    grabOffsetY = event.clientY - itemBounds.top;
    item.setPointerCapture(event.pointerId);
    item.classList.add("is-dragging");
  });

  item.addEventListener("pointermove", (event) => {
    if (!item.hasPointerCapture(event.pointerId)) return;
    const maxX = Math.max(0, parentBounds.width - item.offsetWidth);
    const maxY = Math.max(0, parentBounds.height - item.offsetHeight);
    const left = Math.min(maxX, Math.max(0, event.clientX - parentBounds.left - grabOffsetX));
    const top = Math.min(maxY, Math.max(0, event.clientY - parentBounds.top - grabOffsetY));
    item.style.left = `${(left / parentBounds.width) * 100}%`;
    item.style.top = `${(top / parentBounds.height) * 100}%`;
    item.style.right = "auto";
    item.style.bottom = "auto";
  });

  item.addEventListener("pointerup", (event) => {
    if (!item.hasPointerCapture(event.pointerId)) return;
    item.releasePointerCapture(event.pointerId);
    item.classList.remove("is-dragging");
    roomLayout[item.dataset.piece] = {
      left: parseFloat(item.style.left),
      top: parseFloat(item.style.top),
    };
    localStorage.setItem("pixel-world-room-layout", JSON.stringify(roomLayout));
  });
});

let score = 0;
let playing = false;
let roundTimer;
const scoreDisplay = document.querySelector("#arcade-score");
const highScoreDisplay = document.querySelector("#high-score");
const highScore = Number(localStorage.getItem("pixel-world-high-score")) || 0;
highScoreDisplay.textContent = String(highScore).padStart(4, "0");

function endGame() {
  playing = false;
  document.querySelector("#arcade-instruction").textContent = `FIM DE JOGO! VOCÊ FEZ ${String(score).padStart(4, "0")} PONTOS`;
  document.querySelector("#play-arcade").innerHTML = 'JOGAR DE NOVO <span>→</span>';
}

document.querySelector("#play-arcade").addEventListener("click", () => {
  clearTimeout(roundTimer);
  score = 0;
  playing = true;
  scoreDisplay.textContent = "0000";
  document.querySelector("#arcade-instruction").textContent = "CLIQUE NA ESTRELA ANTES QUE O TEMPO ACABE!";
  document.querySelector("#play-arcade").innerHTML = 'EM JOGO... <span>★</span>';
  roundTimer = setTimeout(endGame, 15000);
});
document.querySelector("#arcade-star").addEventListener("click", () => {
  if (!playing) {
    showToast("Aperte “Começar a jogar” para iniciar! 🎮");
    return;
  }
  score += 10;
  coins += 10;
  scoreDisplay.textContent = String(score).padStart(4, "0");
  updateCoins();
  const currentHigh = Number(localStorage.getItem("pixel-world-high-score")) || 0;
  if (score > currentHigh) {
    localStorage.setItem("pixel-world-high-score", String(score));
    highScoreDisplay.textContent = String(score).padStart(4, "0");
  }
  const star = document.querySelector("#arcade-star");
  star.style.left = `${18 + Math.floor(Math.random() * 65)}%`;
  star.style.top = `${18 + Math.floor(Math.random() * 56)}%`;
});
