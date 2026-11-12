#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn historique_garde_les_evenements() {
        let h = Historique { vus: RefCell::new(Vec::new()) };
        h.notifier("a");
        h.notifier("b");
        assert_eq!(*h.vus.borrow(), vec!["a".to_string(), "b".to_string()], "l'historique garde l'ordre");
    }

    #[test]
    fn un_observateur_recoit_tout() {
        let h = Rc::new(Historique { vus: RefCell::new(Vec::new()) });
        let mut sujet = Sujet::nouveau();
        sujet.abonner(h.clone());
        sujet.emettre("a");
        sujet.emettre("b");
        assert_eq!(*h.vus.borrow(), vec!["a".to_string(), "b".to_string()], "l'observateur reçoit les deux événements");
    }

    #[test]
    fn tous_les_observateurs_sont_prevenus() {
        let h = Rc::new(Historique { vus: RefCell::new(Vec::new()) });
        let c = Rc::new(Compteur { total: Cell::new(0) });
        let mut sujet = Sujet::nouveau();
        sujet.abonner(h.clone());
        sujet.abonner(c.clone());
        sujet.emettre("x");
        assert_eq!(h.vus.borrow().len(), 1, "l'historique est prévenu");
        assert_eq!(c.total.get(), 1, "le compteur est prévenu");
    }

    #[test]
    fn sans_abonne_rien_ne_se_passe() {
        let sujet = Sujet::nouveau();
        sujet.emettre("personne");
        assert_eq!(sujet.observateurs.len(), 0, "aucun observateur");
    }
}
