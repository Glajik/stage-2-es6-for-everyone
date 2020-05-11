import { controls } from '../../constants/controls';

const CRIT_DELAY_SECONDS = 10;

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over

    const playerOne = firstFighter._id;
    const playerTwo = secondFighter._id;

    const playerById = {
      [playerOne]: 'playerOne',
      [playerTwo]: 'playerTwo',
    };

    const maxHealthById = {
      [playerOne]: firstFighter.health,
      [playerTwo]: secondFighter.health,
    };

    const combinationsById = {
      [playerOne]: controls.PlayerOneCriticalHitCombination,
      [playerTwo]: controls.PlayerTwoCriticalHitCombination,
    };

    const indicatorById = {
      [playerOne]: document.getElementById('left-fighter-indicator'),
      [playerTwo]: document.getElementById('right-fighter-indicator'),
    };
    
    const fighters = {
      [playerOne]: [firstFighter, secondFighter],
      [playerTwo]: [secondFighter, firstFighter],
    };

    // Players state
    const IDLE = 'IDLE';
    const ATTACK = 'ATTACK';
    const BLOCK = 'BLOCK';

    // Game state
    const PLAYING = 'PLAYING';
    const FINISH = 'FINISH';

    const state = {
      [playerOne]: {
        action: IDLE, // 'ATTACK' | 'BLOCK'
        lastCritTime: null,
      },
      [playerTwo]: {
        action: IDLE, // 'ATTACK' | 'BLOCK'
        lastCritTime: null,
      },
      game: PLAYING,
      keyCodeQueue: [],
    }

    const addToQueue = (keyKode) => {
      const [, second, third] = state.keyCodeQueue;
      state.keyCodeQueue = [second, third, keyKode];
    };

    const updateIndicator = (fighter) => {
      const { _id, health } = fighter;
      const element = indicatorById[_id];
      if (!element) {
        return;
      }
      const maxHealth = maxHealthById[_id];
      const percent = Math.round(100 / maxHealth * health);
      element.setAttribute('style', `width: ${percent}%`);
    }

    const canBlock = (player) => {
      if (state.game === FINISH) {
        return false;
      }
      switch (state[player].action) {
        case IDLE:
        case ATTACK:
          return true;
        default:
          return false;
      }
    };

    const canAttack = (player) => {
      if (state.game === FINISH) {
        return false;
      }
      switch (state[player].action) {
        case IDLE:
          return true;
        default:
          return false;
      }
    };

    const fromNow = (date) => {
      if (!date) {
        return 0;
      }
      const diffMs = Math.abs(new Date().getTime() - new Date(date).getTime());
      return diffMs / 1000;
    }

    const canCrit = (player) => {
      const { lastCritTime } = state[player];
      
      const gotCombination = combinationsById[player]
        .every(keyCode => state.keyCodeQueue.includes(keyCode));

        console.log('lastCritTime', lastCritTime);
        console.log('fromNow(lastCritTime)', fromNow(lastCritTime));
      
      if (!lastCritTime && gotCombination) {
        return true;
      }
            
      return gotCombination && fromNow(lastCritTime) >= CRIT_DELAY_SECONDS;
    }

    const updateCritTime = player => state[player].lastCritTime = new Date();

    const setPlayerState = (player, newState) => {
      state[player].action = newState;
      console.log('State changed, ', playerById[player], state[player].action);
    }

    const finishGame = (winner) => {
      if (state.game !== PLAYING) {
        return;
      }
      state.game = FINISH;
      return resolve(winner);
    }

    const hasBlock = player => state[player].action === BLOCK;
    
    const attackBy = (player, crit = false) => {
      if (!canAttack(player) && !crit) {
        return;
      }
      if (crit) {
        updateCritTime(player);
      }
      setPlayerState(player, ATTACK);
      const [attacker, defender] = fighters[player];

      const damage = (
        crit
          ? getHitPower(attacker) * 2
          : hasBlock(defender._id)
            ? 0
            : getDamage(attacker, defender)
      );

      if (damage >= defender.health) {
        defender.health = 0;
        updateIndicator(defender);
        return finishGame(attacker);
      }
      defender.health -= damage;
      updateIndicator(defender);
      console.log(`Defender ${defender.name}, ${defender.health}`);
    }

    const blockBy = (player) => {
      if (!canBlock(player)) {
        return;
      }
      setPlayerState(player, BLOCK);
    }

    const tryCritBy = (player) => {
      if (canCrit(player)) {
        const [attacker, defender] = fighters[player];
        const damage = 
        updateCritTime(player);
      }

      if (damage >= defender.health) {
        defender.health = 0;
        updateIndicator(defender);
        return finishGame(attacker);
      }
      defender.health -= damage;
      updateIndicator(defender);
      console.log(`Defender ${defender.name}, ${defender.health}`);
    }

    const onKeyDown = (event) => {
      switch (event.code) {
        case controls.PlayerOneAttack:
          attackBy(playerOne);
          break;
        
        case controls.PlayerTwoAttack:
          attackBy(playerTwo);
          break;

        case controls.PlayerOneBlock:
          blockBy(playerOne);
          break;

        case controls.PlayerTwoBlock:
          blockBy(playerTwo);
          break;

        default:
          addToQueue(event.code);
          canCrit(playerOne) && attackBy(playerOne, true)
          canCrit(playerTwo) && attackBy(playerTwo, true);
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case controls.PlayerOneAttack:
          if (state[playerOne] === BLOCK) {
            break;
          }
        case controls.PlayerOneBlock:
          setPlayerState(playerOne, IDLE);
          break;

          case controls.PlayerTwoAttack:
            if (state[playerTwo] === BLOCK) {
              break;
            }
          case controls.PlayerTwoBlock:
            setPlayerState(playerTwo, IDLE);
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
  });
}

const withChance = (value) => {
  const chance = Math.random() + 1;
  return value * chance;
}

// return hit power
export const getHitPower = (fighter) => withChance(fighter.attack);

// return block power
export const getBlockPower = (fighter) => withChance(fighter.defense);

// return damage
export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return damage > 0 ? damage : 0;
}




