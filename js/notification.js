const DUREE = 8000;

let zone = null;

function zoneNotifications() {
  if (zone?.isConnected) return zone;
  zone = document.createElement('div');
  zone.className = 'notifications';
  zone.setAttribute('role', 'status');
  zone.setAttribute('aria-live', 'polite');
  document.body.append(zone);
  return zone;
}

export function notifier(message, { type = 'erreur', duree = DUREE } = {}) {
  if (typeof document === 'undefined') return;
  const conteneur = zoneNotifications();
  const deja = [...conteneur.children].find((element) => element.dataset.message === message);
  if (deja) return;

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.dataset.message = message;
  const texte = document.createElement('p');
  texte.textContent = message;
  const fermer = document.createElement('button');
  fermer.type = 'button';
  fermer.className = 'notification-fermer';
  fermer.textContent = '×';
  fermer.setAttribute('aria-label', 'Fermer le message');
  notification.append(texte, fermer);
  conteneur.append(notification);

  const retirer = () => notification.remove();
  fermer.addEventListener('click', retirer);
  if (duree > 0) setTimeout(retirer, duree);
}
