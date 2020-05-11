import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';
import App from '../../app';

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
    onClose: () => {
      const root = document.getElementById('root');
      root.innerHTML = '';
      new App();
    },
  });
}
