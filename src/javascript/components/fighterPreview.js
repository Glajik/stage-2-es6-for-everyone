import { createElement, addText } from '../helpers/domHelper';

/*
  <section class="fighter-preview__info">
    <h1>Dhalsim</h1>
    <ul>
      <li>5</li>
      <li>4</li>
      <li>35</li>
    </ul>
  </section>
*/
function renderFighterInfo(fighter) {
  // Create stat list
  const createStatItem = (prop) => {
    const element = createElement({ tagName: 'li' });
    addText(element, prop);
    return element;
  }
  
  const { health, attack, defense } = fighter;
  const stats = [health, attack, defense];

  const listElement = createElement({ tagName: 'ul' });
  stats.map(prop => createStatItem(prop))
    .forEach(itemEl => listElement.append(itemEl));

  // Get fighters name
  const { name } = fighter;
  const nameElement = createElement({ tagName: 'h1' });
  addText(nameElement, name);

  // Put to fighter info container
  const containerElement = createElement({
    tagName: 'section',
    className: 'fighter-preview__info',
  });

  containerElement.append(nameElement);
  containerElement.append(listElement);
  return containerElement;
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

  
  const fighterInfoElement = renderFighterInfo(fighter);
  fighterElement.append(fighterInfoElement);

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
