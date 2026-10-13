#[cfg(test)]
mod tests {
    use super::*;

    fn exemple() -> Inventaire {
        let mut inventaire = Inventaire::nouveau();
        inventaire.ajouter("pomme", 5);
        inventaire.ajouter("banane", 12);
        inventaire.ajouter("kiwi", 1);
        inventaire
    }

    #[test]
    fn ajouts() {
        let mut inventaire = Inventaire::nouveau();
        assert_eq!(inventaire.quantite("pomme"), 0, "un article absent a une quantité de 0");
        inventaire.ajouter("pomme", 5);
        inventaire.ajouter("pomme", 3);
        assert_eq!(inventaire.quantite("pomme"), 8, "5 + 3 = 8 pommes");
    }

    #[test]
    fn retrait_possible() {
        let mut inventaire = exemple();
        assert_eq!(inventaire.retirer("pomme", 2), Ok(()), "retirer 2 pommes sur 5 doit marcher");
        assert_eq!(inventaire.quantite("pomme"), 3, "il reste 3 pommes");
    }

    #[test]
    fn article_inconnu() {
        let mut inventaire = exemple();
        assert_eq!(
            inventaire.retirer("poire", 1),
            Err(ErreurStock::ArticleInconnu("poire".to_string())),
            "pas de poire dans l'inventaire"
        );
    }

    #[test]
    fn stock_insuffisant() {
        let mut inventaire = exemple();
        assert_eq!(
            inventaire.retirer("pomme", 9),
            Err(ErreurStock::StockInsuffisant {
                article: "pomme".to_string(),
                disponible: 5,
                demande: 9,
            }),
            "on ne peut pas retirer 9 pommes sur 5"
        );
        assert_eq!(inventaire.quantite("pomme"), 5, "un retrait refusé ne change rien");
    }

    #[test]
    fn article_epuise() {
        let mut inventaire = exemple();
        assert_eq!(inventaire.retirer("kiwi", 1), Ok(()), "on retire le dernier kiwi");
        assert_eq!(inventaire.quantite("kiwi"), 0, "plus de kiwi");
        assert_eq!(
            inventaire.retirer("kiwi", 1),
            Err(ErreurStock::ArticleInconnu("kiwi".to_string())),
            "un article épuisé disparaît de l'inventaire"
        );
    }

    #[test]
    fn reapprovisionnement() {
        let inventaire = exemple();
        assert_eq!(inventaire.a_reapprovisionner(6), vec!["kiwi".to_string(), "pomme".to_string()], "kiwi (1) et pomme (5), triés");
        assert!(inventaire.a_reapprovisionner(1).is_empty(), "strictement inférieur : rien sous 1");
    }

    #[test]
    fn affichage() {
        let mut inventaire = exemple();
        inventaire.retirer("kiwi", 1).unwrap();
        assert_eq!(format!("{inventaire}"), "banane : 12\npomme : 5", "une ligne par article, triées, sans retour final");
        assert_eq!(format!("{}", Inventaire::nouveau()), "", "un inventaire vide n'affiche rien");
    }
}
