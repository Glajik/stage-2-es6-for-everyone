import { controls } from '../../constants/controls';

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
      [playerOne]: IDLE, // 'ATTACK' | 'BLOCK'
      [playerTwo]: IDLE, // 'ATTACK' | 'BLOCK'
      game: PLAYING,
    }

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
      switch (state[player]) {
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
      switch (state[player]) {
        case IDLE:
          return true;
        default:
          return false;
      }
    };

    const setPlayerState = (player, newState) => {
      state[player] = newState;
      console.log('State changed, ', playerById[player], state[player]);
    }

    const finishGame = (winner) => {
      if (state.game !== PLAYING) {
        return;
      }
      state.game = FINISH;
      return resolve(winner);
    }

    const attackBy = (player) => {
      if (!canAttack(player)) {
        return;
      }
      setPlayerState(player, ATTACK);
      const [attacker, defender] = fighters[player];
      const damage = getDamage(attacker, defender);
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
      
        default:
          console.log('Ignored key down:', event.code);
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case controls.PlayerOneAttack:
          setPlayerState(playerOne, IDLE);
          break;
        
        case controls.PlayerTwoAttack:
          setPlayerState(playerTwo, IDLE);
          break;
      
        default:
          console.log('Ignored key up:', event.code);
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
  });
}

// return damage
export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  if (damage < 0) {
    return 0;
  }
  return damage;
}

const withChance = (value) => {
  const chance = Math.random() + 1;
  return value * chance;
}

// return hit power
export function getHitPower(fighter) {
  const value = withChance(fighter.attack);
  console.log('Hit pow: ', value);
  return value;
}

// return block power
export function getBlockPower(fighter) {
  const value = withChance(fighter.defense);
  console.log('block: ', value);
  return value;
}
