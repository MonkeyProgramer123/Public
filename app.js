'use strict';
const layouts = [
  { id: 'balanced', name: 'Equilibrada', description: 'Cada assunto encontra o seu lugar.' },
  { id: 'minimal', name: 'Minimalista', description: 'Mais espaço, menos ruído visual.' },
  { id: 'agenda', name: 'Agenda em destaque', description: 'Os seus compromissos em primeiro plano.' },
  { id: 'editorial', name: 'Editorial', description: 'Uma pequena primeira página para o dia.' },
];
let currentEdition = 'morning';
let showBoth = false;
const gallery = document.getElementById('gallery');
const dialog = document.getElementById('preview-dialog');
const editionName = edition => edition === 'morning' ? 'Manhã' : 'Fim do dia';
function drawGallery() {
  gallery.replaceChildren();
  layouts.forEach((layout, index) => {
    for (const edition of showBoth ? ['morning', 'evening'] : [currentEdition]) {
      const path = `images/${layout.id}-${edition}.png`;
      const card = document.createElement('article');
      card.className = 'card';
      // All strings below are immutable, locally authored labels. No external data is loaded.
      card.innerHTML = `<div class="card-top"><div class="card-identity"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><h2>${layout.name}</h2></div><span class="edition-label">${editionName(edition)}</span></div><div class="image-frame"><button type="button" class="image-button" aria-label="Ampliar ${layout.name}, ${editionName(edition)}"><img src="${path}" alt="Interface ${layout.name}, ${editionName(edition)}. Dados sintéticos." width="1448" height="1072" loading="${index === 0 ? 'eager' : 'lazy'}"></button></div><div class="card-bottom"><p class="card-description">${layout.description}</p><a href="${path}" download="kobo-${layout.id}-${edition}.png">PNG <span aria-hidden="true">↓</span></a></div>`;
      card.querySelector('.image-button').addEventListener('click', () => {
        document.getElementById('dialog-title').textContent = `${layout.name} · ${editionName(edition)}`;
        const preview = document.getElementById('dialog-preview');
        preview.src = path;
        preview.alt = `${layout.name}, ${editionName(edition)} — dados sintéticos`;
        document.getElementById('dialog-download').href = path;
        dialog.showModal();
      });
      gallery.append(card);
    }
  });
}
document.querySelectorAll('[data-edition]').forEach(button => button.addEventListener('click', () => {
  currentEdition = button.dataset.edition;
  document.querySelectorAll('[data-edition]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  drawGallery();
}));
document.getElementById('show-both').addEventListener('click', event => {
  showBoth = !showBoth;
  event.currentTarget.setAttribute('aria-pressed', String(showBoth));
  event.currentTarget.textContent = showBoth ? 'Ver uma edição' : 'Ver as oito';
  drawGallery();
});
document.getElementById('scale').addEventListener('change', event => document.body.classList.toggle('native', event.target.value === 'native'));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
drawGallery();
