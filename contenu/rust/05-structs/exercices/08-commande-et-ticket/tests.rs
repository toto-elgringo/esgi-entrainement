#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn commande_vide() {
        assert_eq!(Commande::new(), Commande { plats: 0, total: 0 }, "une nouvelle commande est vide");
    }

    #[test]
    fn ajouter_des_plats() {
        let commande = Commande::new().ajouter(12).ajouter(5);
        assert_eq!(commande, Commande { plats: 2, total: 17 }, "2 plats pour un total de 12 + 5 = 17");
    }

    #[test]
    fn payer() {
        let ticket = Commande::new().ajouter(12).ajouter(5).payer(7);
        assert_eq!(ticket, Ticket { numero: 7, montant: 17 }, "le ticket n°7 doit avoir un montant de 17");
    }

    #[test]
    fn payer_une_commande_vide() {
        assert_eq!(Commande::new().payer(1), Ticket { numero: 1, montant: 0 }, "une commande vide donne un ticket à 0");
    }
}
