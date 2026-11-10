#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn degats_des_armes() {
        assert_eq!(degats(&Objet::Arme(Arme::Epee { degats: 9 })), 9, "une épée de 9 fait 9 dégâts");
        assert_eq!(degats(&Objet::Arme(Arme::Hache { degats: 12 })), 12, "une hache de 12 fait 12 dégâts");
        assert_eq!(degats(&Objet::Arme(Arme::Arc { degats: 7, portee: 40 })), 7, "un arc de 7 fait 7 dégâts");
    }

    #[test]
    fn pas_de_degats_hors_armes() {
        assert_eq!(degats(&Objet::Rien), 0, "rien ne fait 0 dégât");
        assert_eq!(degats(&Objet::Armure { defense: 5 }), 0, "une armure ne fait pas de dégâts");
        assert_eq!(degats(&Objet::Potion(Potion::Soin(10))), 0, "une potion ne fait pas de dégâts");
    }

    #[test]
    fn portee_seulement_pour_l_arc() {
        assert_eq!(portee(&Objet::Arme(Arme::Arc { degats: 7, portee: 40 })), Some(40), "un arc porte à 40 m");
        assert_eq!(portee(&Objet::Arme(Arme::Epee { degats: 9 })), None, "une épée n'a pas de portée");
        assert_eq!(portee(&Objet::Armure { defense: 1 }), None, "une armure n'a pas de portée");
        assert_eq!(portee(&Objet::Rien), None, "rien n'a pas de portée");
    }

    #[test]
    fn decrire_les_objets_simples() {
        assert_eq!(decrire(&Objet::Rien), "rien", "Objet::Rien");
        assert_eq!(decrire(&Objet::Armure { defense: 3 }), "armure (3 de défense)", "une armure de 3");
    }

    #[test]
    fn decrire_les_armes() {
        assert_eq!(
            decrire(&Objet::Arme(Arme::Arc { degats: 7, portee: 40 })),
            "arc : 7 dégâts à 40 m",
            "l'arc a sa propre description"
        );
        assert_eq!(decrire(&Objet::Arme(Arme::Epee { degats: 9 })), "arme de corps à corps", "une épée");
        assert_eq!(decrire(&Objet::Arme(Arme::Hache { degats: 2 })), "arme de corps à corps", "une hache");
    }

    #[test]
    fn decrire_les_potions() {
        assert_eq!(decrire(&Objet::Potion(Potion::Soin(20))), "potion de soin (+20)", "potion de soin de 20");
        assert_eq!(decrire(&Objet::Potion(Potion::Force(3))), "potion de force (+3)", "potion de force positive");
        assert_eq!(decrire(&Objet::Potion(Potion::Force(-2))), "potion de force (-2)", "potion de force négative");
    }
}
