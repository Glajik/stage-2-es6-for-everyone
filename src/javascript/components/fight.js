import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    
    const onKeyDown = (event) => {
      console.log(event.code);
      switch (event.code) {
        case controls.PlayerOneAttack:
          
          break;
      
        default:
          break;
      }

    };

    document.addEventListener('keydown', event => onKeyDown(event), true);

    resolve(firstFighter);
  });
}

export function getDamage(attacker, defender) {
  // return damage
}

export function getHitPower(fighter) {
  // return hit power
}

export function getBlockPower(fighter) {
  // return block power
}
