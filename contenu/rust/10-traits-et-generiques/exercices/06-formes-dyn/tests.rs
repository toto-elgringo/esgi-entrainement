#[cfg(test)]
mod tests {
    use super::*;

    fn presque_egal(a: f64, b: f64) -> bool {
        (a - b).abs() < 1e-9
    }

    #[test]
    fn aires_simples() {
        assert!(presque_egal(Rectangle { largeur: 2.0, hauteur: 3.0 }.aire(), 6.0), "rectangle 2 × 3 : aire 6");
        assert!(presque_egal(Cercle { rayon: 1.0 }.aire(), PI), "cercle de rayon 1 : aire π");
        assert!(presque_egal(Cercle { rayon: 2.0 }.aire(), 4.0 * PI), "cercle de rayon 2 : aire 4π");
    }

    #[test]
    fn le_carre() {
        let carre = Carre { cote: 3.0 };
        assert!(presque_egal(carre.aire(), 9.0), "carré de côté 3 : aire 9");
        assert_eq!(carre.nom(), "carré", "le nom du carré");
    }

    #[test]
    fn total() {
        let formes: Vec<Box<dyn Forme>> = vec![
            Box::new(Rectangle { largeur: 2.0, hauteur: 3.0 }),
            Box::new(Cercle { rayon: 1.0 }),
            Box::new(Carre { cote: 2.0 }),
        ];
        assert!(presque_egal(aire_totale(&formes), 6.0 + PI + 4.0), "6 + π + 4");
        assert!(presque_egal(aire_totale(&[]), 0.0), "aucune forme : aire totale 0");
    }

    #[test]
    fn la_plus_grande() {
        let formes: Vec<Box<dyn Forme>> = vec![
            Box::new(Rectangle { largeur: 2.0, hauteur: 1.0 }),
            Box::new(Cercle { rayon: 1.0 }),
            Box::new(Carre { cote: 1.5 }),
        ];
        assert_eq!(nom_de_la_plus_grande(&formes), Some("cercle".to_string()), "le cercle (π) est plus grand que 2 et 2,25");
        assert_eq!(nom_de_la_plus_grande(&[]), None, "aucune forme : None");
    }
}
