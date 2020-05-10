import { createElement } from '../helpers/domHelper';

function addText(element, text) {
  const node = document.createTextNode(text);
  element.appendChild(node);
}

export function createFighterPreview(fighter, position) {
  const positionClassName = (
    position === 'right'
      ? 'fighter-preview___right'
      : 'fighter-preview___left'
  );

  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  if (!fighter) {
    const selectFighterElement = createElement({
      tagName: 'p',
      className: 'fighter-preview___select-fighter',
    });

    addText(selectFighterElement, 'Select');

    fighterElement.append(selectFighterElement);
    return fighterElement;
  }
  
  const imageElement = createFighterImage(fighter);
  fighterElement.append(imageElement);

  fighterElement.addEventListener('click', () => console.log(`Click to fighter preview ${fighter._id}`));

  return fighterElement;
}

export function createFighterImage(fighter) {
  console.log('createFighterImage')
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
