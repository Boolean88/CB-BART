const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 25;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let chosenMaxLife;

function getMaxLifeValues() {
	const enteredValue = prompt('Enter the maximum life: ', '100');
	let parsedValue = parseInt(enteredValue);

	if (isNaN(parsedValue) || parsedValue <= 0 || parsedValue > 100) {
		throw { message: 'Invalid User Input.' };
	}
	return parsedValue;
}

try {
	chosenMaxLife = getMaxLifeValues();
} catch (error) {
	console.log(error);
	chosenMaxLife = 100;
	alert('Wrong input. Input has to be a number');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

//Keuzes, uitkomst enz naar log
function writeToLog(ev, val, monsterHealth, playerHealth) {
	let = logEntry = {
		event: ev,
		value: val,
		finalMonsterHealth: monsterHealth,
		finalPlayerHealth: playerHealth,
	};
	switch (ev) {
		case LOG_EVENT_PLAYER_ATTACK:
			logEntry.target = 'MONSTER';
			break;
		case LOG_EVENT_PLAYER_STRONG_ATTACK:
			logEntry.target = 'MONSTER';
			break;
		case LOG_EVENT_MONSTER_ATTACK:
			logEntry.target = 'PLAYER';
			break;
		case LOG_EVENT_PLAYER_HEAL:
			logEntry.target = 'PLAYER';
			break;
		case LOG_EVENT_GAME_OVER:
			break;
		default:
			logEntry = {};
	}
	battleLog.push(logEntry);
}

//functionaliteiten bij verscillende attackmodes
function attackMonster(mode) {
	let maxDamage;
	let logEvent;
	if (mode === MODE_ATTACK) {
		maxDamage = ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_ATTACK;
	} else if (mode === MODE_STRONG_ATTACK) {
		maxDamage = STRONG_ATTACK_VALUE;
		logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
	}
	const damage = dealMonsterDamage(maxDamage);
	currentMonsterHealth -= damage;
	writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
	endRound();
}

function attackHandler() {
	attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
	attackMonster(MODE_STRONG_ATTACK);
}

//Einde ronde incl geruik bonus leven
function endRound() {
	const initialPlayerHealth = currentPlayerHealth;
	const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
	currentPlayerHealth -= playerDamage;
	writeToLog(
		LOG_EVENT_MONSTER_ATTACK,
		playerDamage,
		currentMonsterHealth,
		currentPlayerHealth
	);

	if (currentPlayerHealth <= 0 && hasBonusLife) {
		hasBonusLife = false;
		removeBonusLife();
		currentPlayerHealth = initialPlayerHealth;
		setPlayerHealth(initialPlayerHealth);
		alert('Bonus life used');
	}
	if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
		alert('You Won!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'PLAYER WON',
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
		alert('You Lost!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'MONSTER WON',
			currentMonsterHealth,
			currentPlayerHealth
		);
	} else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
		alert('Draw!');
		writeToLog(
			LOG_EVENT_GAME_OVER,
			'A DRAW',
			currentMonsterHealth,
			currentPlayerHealth
		);
	}
	if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
		reset();
	}
}

//Heal functie bij minder dan 80% leven
function healPlayerHandler() {
	let healValue;
	if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
		healValue = chosenMaxLife - currentPlayerHealth;
		alert('You still have enough health available');
	} else {
		healValue = HEAL_VALUE;
	}
	increasePlayerHealth(healValue);
	currentPlayerHealth += healValue;
	writeToLog(
		LOG_EVENT_PLAYER_HEAL,
		healValue,
		currentMonsterHealth,
		currentPlayerHealth
	);
	endRound();
}

//reset bij einde spel
function reset() {
	currentMonsterHealth = chosenMaxLife;
	currentPlayerHealth = chosenMaxLife;
	resetGame(chosenMaxLife);
}

//Log keuzes en uitkomsten per beurt
function printLogHandler() {
	let i = 0;
	for (const logEntry of battleLog) {
		console.log(`Turn: #${i}`);
		for (const key in logEntry) {
			console.log(`${key} => ${logEntry[key]}`);
		}
		i++;
	}
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
