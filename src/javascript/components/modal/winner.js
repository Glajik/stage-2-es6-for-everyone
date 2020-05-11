import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';

// call showModal function 
export function showWinnerModal(fighter) {
  const { name } = fighter;

  const image = createFighterImage(fighter);

  const bodyElement = createElement({
    tagName: 'div',
    attributes: {
      style: `
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50vw;
        height: 50vh;
      `
    }
  });

  bodyElement.append(image);

  showModal({
    title: `Winner is ${name}! Good game!!`,
    bodyElement,
  });
}
