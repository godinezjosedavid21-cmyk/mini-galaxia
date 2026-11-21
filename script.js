import * as THREE from "three";

// ==========================================
// 1. CONFIGURACIÓN DEL UNIVERSO
// ==========================================

const container = document.getElementById("universe");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.0018);

const camera = new THREE.PerspectiveCamera(
	65,
	window.innerWidth / window.innerHeight,
	0.1,
	1500
);

camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({
	antialias: true,
	powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
container.appendChild(renderer.domElement);

// ==========================================
// 2. ILUMINACIÓN
// ==========================================

scene.add(new THREE.AmbientLight(0xffffff, 1));

const mainLight = new THREE.PointLight(
	0x9b4dff, 100, 150
);

scene.add(mainLight);

// ==========================================
// 3. TEXTURA DE BRILLO
// ==========================================

function createGlowTexture() {

	const canvas = document.createElement("canvas");
	canvas.width = 128;
	canvas.height = 128;

	const ctx = canvas.getContext("2d");

	const gradient = ctx.createRadialGradient(
		64, 64, 0,
		64, 64, 64
	);

	gradient.addColorStop(0, "rgba(255,255,255,1)");
	gradient.addColorStop(0.15, "rgba(255,255,255,0.8)");
	gradient.addColorStop(0.4, "rgba(180,100,255,0.25)");
	gradient.addColorStop(1, "rgba(100,0,255,0)");

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 128, 128);

	return new THREE.CanvasTexture(canvas);
}

const glowTexture = createGlowTexture();

// ==========================================
// 4. ESTRELLAS DEL ESPACIO
// ==========================================

function createStars() {

	const count = 3500;
	const positions = [];

	for (let i = 0; i < count; i++) {

		positions.push(
			(Math.random() - 0.5) * 900,
			(Math.random() - 0.5) * 600,
			(Math.random() - 0.5) * 900
		);
	}

	const geometry = new THREE.BufferGeometry();

	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3)
	);

	const material = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 0.8,
		transparent: true,
		opacity: 0.8,
		sizeAttenuation: true
	});

	const stars = new THREE.Points(geometry, material);
	scene.add(stars);

	return stars;
}

const stars = createStars();

// ==========================================
// 5. ENERGÍA DEL BIG BANG
// ==========================================

const energy = new THREE.Group();
scene.add(energy);

const coreMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff
});

const core = new THREE.Mesh(
	new THREE.SphereGeometry(0.8, 32, 32),
	coreMaterial
);

energy.add(core);

const coreGlow = new THREE.Sprite(
	new THREE.SpriteMaterial({
		map: glowTexture,
		color: 0x9e55ff,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	})
);

coreGlow.scale.set(12, 12, 1);
energy.add(coreGlow);

// ==========================================
// 6. PARTÍCULAS DE LA EXPLOSIÓN
// ==========================================

const explosionCount = 6000;

const explosionGeometry = new THREE.BufferGeometry();

const explosionPositions = new Float32Array(
	explosionCount * 3
);

const explosionDirections = [];
const explosionSpeeds = [];

const explosionColors = [];

const palette = [
	new THREE.Color("#ffffff"),
	new THREE.Color("#00d9ff"),
	new THREE.Color("#8c42ff"),
	new THREE.Color("#ff39bc"),
	new THREE.Color("#ffb347")
];

for (let i = 0; i < explosionCount; i++) {

	const direction = new THREE.Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1
	).normalize();

	explosionDirections.push(direction);

	explosionSpeeds.push(
		5 + Math.random() * 24
	);

	const color = palette[
		Math.floor(Math.random() * palette.length)
	];

	explosionColors.push(color.r, color.g, color.b);
}

explosionGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(explosionPositions, 3)
);

explosionGeometry.setAttribute(
	"color",
	new THREE.Float32BufferAttribute(explosionColors, 3)
);

const explosionMaterial = new THREE.PointsMaterial({
	size: 0.7,
	vertexColors: true,
	transparent: true,
	opacity: 0,
	blending: THREE.AdditiveBlending,
	depthWrite: false
});

const explosion = new THREE.Points(
	explosionGeometry,
	explosionMaterial
);

scene.add(explosion);

// ==========================================
// 7. MATERIA CÓSMICA EN MOVIMIENTO
// ==========================================

const dustCount = 4500;
const dustGeometry = new THREE.BufferGeometry();

const dustPositions = new Float32Array(dustCount * 3);
const dustColors = [];

for (let i = 0; i < dustCount; i++) {

	dustPositions[i * 3] = (Math.random() - 0.5) * 100;
	dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
	dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 180;

	const color = palette[
		Math.floor(Math.random() * palette.length)
	];

	dustColors.push(color.r, color.g, color.b);
}

dustGeometry.setAttribute(
	"position",
	new THREE.BufferAttribute(dustPositions, 3)
);

dustGeometry.setAttribute(
	"color",
	new THREE.Float32BufferAttribute(dustColors, 3)
);

const dustMaterial = new THREE.PointsMaterial({
	size: 1.1,
	vertexColors: true,
	transparent: true,
	opacity: 0,
	blending: THREE.AdditiveBlending,
	depthWrite: false
});

const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// ==========================================
// 8. CREACIÓN DE LA GALAXIA ESPIRAL
// ==========================================

const galaxy = new THREE.Group();
scene.add(galaxy);

const galaxyCount = 16000;
const galaxyGeometry = new THREE.BufferGeometry();

const galaxyPositions = new Float32Array(
	galaxyCount * 3
);

const galaxyColors = [];

const galaxyPalette = [
	new THREE.Color("#ffffff"),
	new THREE.Color("#a76bff"),
	new THREE.Color("#4c9dff"),
	new THREE.Color("#ff68d2"),
	new THREE.Color("#ffc36e")
];

for (let i = 0; i < galaxyCount; i++) {

	const arm = i % 5;

	const radius = Math.random() * 17;
	const angle =
		arm * (Math.PI * 2 / 5) +
		radius * 0.38 +
		(Math.random() - 0.5) * 0.5;

	const spread = (Math.random() - 0.5) * 1.8;

	galaxyPositions[i * 3] =
		Math.cos(angle) * radius +
		spread;

	galaxyPositions[i * 3 + 1] =
		Math.sin(angle) * radius * 0.58 +
		spread * 0.4;

	galaxyPositions[i * 3 + 2] =
		(Math.random() - 0.5) * 1.5;

	const color = galaxyPalette[
		Math.floor(Math.random() * galaxyPalette.length)
	];

	galaxyColors.push(color.r, color.g, color.b);
}

galaxyGeometry.setAttribute(
	"position",
	new THREE.Float32BufferAttribute(galaxyPositions, 3)
);

galaxyGeometry.setAttribute(
	"color",
	new THREE.Float32BufferAttribute(galaxyColors, 3)
);

const galaxyMaterial = new THREE.PointsMaterial({
	size: 0.65,
	vertexColors: true,
	transparent: true,
	opacity: 0,
	blending: THREE.AdditiveBlending,
	depthWrite: false
});

const galaxyParticles = new THREE.Points(
	galaxyGeometry,
	galaxyMaterial
);

galaxy.add(galaxyParticles);

// Centro brillante de la galaxia

const galaxyCore = new THREE.Sprite(
	new THREE.SpriteMaterial({
		map: glowTexture,
		color: 0xffa7e8,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	})
);

galaxyCore.scale.set(8, 8, 1);
galaxy.add(galaxyCore);

// ==========================================
// 9. FUNCIONES DE ANIMACIÓN
// ==========================================

function smooth(a, b, t) {

	const x = THREE.MathUtils.clamp(
		(t - a) / (b - a),
		0, 1
	);

	return x * x * (3 - 2 * x);
}

function updateExplosion(t) {

	const duration = Math.max(0, t - 10);

	for (let i = 0; i < explosionCount; i++) {

		const direction = explosionDirections[i];
		const speed = explosionSpeeds[i];

		const distance = duration * speed;

		explosionPositions[i * 3] =
			direction.x * distance;

		explosionPositions[i * 3 + 1] =
			direction.y * distance;

		explosionPositions[i * 3 + 2] =
			direction.z * distance;
	}

	explosionGeometry.attributes.position.needsUpdate = true;
}

function updateDust(t) {

	const positions = dustGeometry.attributes.position.array;

	for (let i = 0; i < dustCount; i++) {

		const index = i * 3;

		positions[index + 2] += 0.12;

		if (positions[index + 2] > 90) {
			positions[index + 2] = -90;
		}

	}

	dustGeometry.attributes.position.needsUpdate = true;
}

// ==========================================
// 10. LÍNEA TEMPORAL DE 75 SEGUNDOS
// ==========================================

const TOTAL_TIME = 75;

let elapsed = 0;
let playing = false;
let previousTime = 0;

const intro = document.getElementById("intro");
const hud = document.getElementById("hud");
const ending = document.getElementById("ending");

const progress = document.getElementById("progress");
const timeText = document.getElementById("timeText");
const sceneName = document.getElementById("sceneName");
const description = document.getElementById("description");

function updateScene(t, delta) {

	const reveal = smooth(45, 65, t);

	// ESTRELLAS

	stars.rotation.y += delta * 0.002;

	// PRIMERA ETAPA: ENERGÍA

	const initial = 1 - smooth(10, 13, t);

	const pulse = 1 + Math.sin(t * 4) * 0.15;

	energy.visible = t < 13;
	energy.scale.setScalar(
		(0.15 + initial * 0.85) * pulse
	);

	coreGlow.material.opacity = initial;
	coreGlow.scale.setScalar(12 + Math.sin(t * 3) * 2);

	// SEGUNDA ETAPA: EXPLOSIÓN

	const explosionFade =
		smooth(9, 12, t) * (1 - smooth(38, 45, t));

	explosion.visible = t >= 10 && t < 45;
	explosionMaterial.opacity = explosionFade;

	if (t >= 10 && t < 45) {
		updateExplosion(t);
	}

	// TERCERA ETAPA: VIAJE CÓSMICO

	const journey = smooth(25, 30, t) *
					(1 - smooth(43, 46, t));

	dustMaterial.opacity = journey;

	if (t >= 25 && t < 46) {
		updateDust(t);
	}

	// CUARTA ETAPA: NACIMIENTO DE GALAXIA

	galaxy.visible = t >= 45;

	galaxyParticles.material.opacity = reveal;

	galaxy.scale.setScalar(
		0.01 + reveal * 0.99
	);

	galaxy.rotation.z = t * 0.035;

	galaxyCore.material.opacity = reveal;

	// QUINTA ETAPA: CÁMARA

	if (t < 10) {

		camera.position.set(
			Math.sin(t * 0.3) * 0.3,
			0,
			30 - smooth(0, 10, t) * 5
		);

	} else if (t < 25) {

		const p = smooth(10, 25, t);

		camera.position.set(
			Math.sin(t * 0.8) * 3,
			Math.cos(t * 0.6) * 2,
			25 - p * 18
		);

	} else if (t < 45) {

		const p = smooth(25, 45, t);

		camera.position.set(
			Math.sin(t * 0.7) * 5,
			Math.sin(t * 0.4) * 3,
			7 - p * 16
		);

	} else {

		const p = smooth(45, 65, t);

		const distance = 23 + p * 19;

		camera.position.set(
			Math.sin(t * 0.08) * 3,
			Math.cos(t * 0.08) * 2,
			distance
		);
	}

	camera.lookAt(0, 0, 0);

	// ETAPAS Y TEXTOS

	if (t < 10) {
		sceneName.textContent = "EL ORIGEN";
		description.textContent =
			"Todo comienza en la oscuridad...";
	} else if (t < 25) {
		sceneName.textContent = "EL BIG BANG";
		description.textContent =
			"La energía comienza a expandirse...";
	} else if (t < 45) {
		sceneName.textContent = "EL VIAJE CÓSMICO";
		description.textContent =
			"Atravesando el nacimiento de la materia...";
	} else if (t < 65) {
		sceneName.textContent = "FORMACIÓN GALÁCTICA";
		description.textContent =
			"La materia se une y comienza a girar...";
	} else {
		sceneName.textContent = "UN NUEVO UNIVERSO";
		description.textContent =
			"Una galaxia nace entre las estrellas...";
	}

	progress.style.width = (t / TOTAL_TIME * 100) + "%";

	const seconds = Math.floor(t);
	const minutes = Math.floor(seconds / 60);

	timeText.textContent =
		String(minutes).padStart(2, "0") + ":" +
		String(seconds % 60).padStart(2, "0") +
		" / 01:15";
}

// ==========================================
// 11. INICIAR Y REINICIAR
// ==========================================

function startExperience() {

	elapsed = 0;
	previousTime = performance.now();
	playing = true;

	intro.style.opacity = "0";
	intro.style.pointerEvents = "none";

	ending.style.opacity = "0";
	ending.style.visibility = "hidden";

	hud.style.opacity = "1";
}

document.getElementById("startButton")
	.addEventListener("click", startExperience);

document.getElementById("replayButton")
	.addEventListener("click", startExperience);

document.getElementById("againButton")
	.addEventListener("click", startExperience);

// ==========================================
// 12. BUCLE PRINCIPAL
// ==========================================

function animate(now) {

	requestAnimationFrame(animate);

	const delta = Math.min(
		(now - previousTime) / 1000,
		0.05
	);

	previousTime = now;

	if (playing) {

		elapsed += delta;

		if (elapsed >= TOTAL_TIME) {

			elapsed = TOTAL_TIME;
			playing = false;

			ending.style.visibility = "visible";

			requestAnimationFrame(() => {
				ending.style.opacity = "1";
			});
		}

		updateScene(elapsed, delta);
	}

	renderer.render(scene, camera);
}

requestAnimationFrame(animate);

// ==========================================
// 13. ADAPTACIÓN A LA PANTALLA
// ==========================================

window.addEventListener("resize", () => {

	camera.aspect =
		window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize(
		window.innerWidth,
		window.innerHeight
	);

	renderer.setPixelRatio(
		Math.min(window.devicePixelRatio, 1.7)
	);
});
