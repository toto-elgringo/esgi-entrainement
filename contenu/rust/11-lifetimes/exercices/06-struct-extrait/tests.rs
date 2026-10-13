#[cfg(test)]
mod tests {
    use super::*;

    const LIVRE: &str = "Il était une fois un crabe. Il aimait Rust. Fin.";

    #[test]
    fn premiere_phrase_du_livre() {
        let extrait = Extrait::nouveau(LIVRE);
        assert_eq!(extrait.premiere_phrase(), "Il était une fois un crabe", "le texte avant le premier point");
    }

    #[test]
    fn sans_point() {
        let extrait = Extrait::nouveau("  pas de point ici  ");
        assert_eq!(extrait.premiere_phrase(), "pas de point ici", "sans point : tout le texte, sans espaces autour");
    }

    #[test]
    fn compter_les_mots() {
        assert_eq!(Extrait::nouveau(LIVRE).nombre_de_mots(), 10, "le livre contient 10 mots");
        assert_eq!(Extrait::nouveau("").nombre_de_mots(), 0, "un texte vide contient 0 mot");
    }

    #[test]
    fn la_phrase_survit_a_l_extrait() {
        let livre = String::from("Premier. Second.");
        let phrase;
        {
            let extrait = Extrait::nouveau(&livre);
            phrase = extrait.premiere_phrase();
        }
        assert_eq!(phrase, "Premier", "la phrase reste valable tant que le livre existe");
    }
}
