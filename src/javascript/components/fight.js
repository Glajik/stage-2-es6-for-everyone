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
    
    const fighters = {
      [playerOne]: [firstFighter, secondFighter],
      [playerTwo]: [secondFighter, firstFighter],
    };

    const IDLE = 'IDLE';
    const ATTACK = 'ATTACK';
    const BLOCK = 'BLOCK';

    const state = {
      [playerOne]: IDLE, // 'ATTACK' | 'BLOCK'
      [playerTwo]: IDLE, // 'ATTACK' | 'BLOCK'
    }

    const canBlock = (player) => {
      switch (state[player]) {
        case IDLE:
        case ATTACK:
          return true;
        default:
          return false;
      }
    };

    const canAttack = (player) => {
      switch (state[player]) {
        case IDLE:
          return true;
        default:
          return false;
      }
    };

    const setState = (player, newState) => {
      state[player] = newState;
      console.log('State changed, ', playerById[player], state[player]);
    }

    const attackBy = (player) => {
      if (!canAttack(player)) {
        return;
      }
      setState(player, ATTACK);
      const [attacker, defender] = fighters[player];
      defender.health -= getDamage(attacker, defender);
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
          setState(playerOne, IDLE);
          break;
        
        case controls.PlayerTwoAttack:
          setState(playerTwo, IDLE);
          break;
      
        default:
          console.log('Ignored key up:', event.code);
          break;
      }
    };

    document.addEventListener('keydown', event => onKeyDown(event), true);
    document.addEventListener('keyup', event => onKeyUp(event), true);

    resolve(firstFighter);
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
