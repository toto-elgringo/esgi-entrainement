#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ages_valides() {
        assert_eq!(lire_age("25"), Ok(25), "\"25\" donne Ok(25)");
        assert_eq!(lire_age("  42 "), Ok(42), "les espaces autour sont ignorés");
        assert_eq!(lire_age("0"), Ok(0), "0 est un âge valide");
        assert_eq!(lire_age("150"), Ok(150), "150 est encore accepté");
    }

    #[test]
    fn texte_vide() {
        assert_eq!(lire_age(""), Err(ErreurAge::Vide), "un texte vide donne Vide");
        assert_eq!(lire_age("   "), Err(ErreurAge::Vide), "des espaces seuls donnent Vide");
    }

    #[test]
    fn pas_un_nombre() {
        assert_eq!(lire_age("vingt"), Err(ErreurAge::PasUnNombre), "\"vingt\" n'est pas un nombre");
        assert_eq!(lire_age("-3"), Err(ErreurAge::PasUnNombre), "un âge négatif n'est pas un u32");
        assert_eq!(lire_age("12.5"), Err(ErreurAge::PasUnNombre), "\"12.5\" n'est pas un entier");
    }

    #[test]
    fn trop_grand() {
        assert_eq!(lire_age("200"), Err(ErreurAge::TropGrand(200)), "200 ans, c'est trop");
        assert_eq!(lire_age("151"), Err(ErreurAge::TropGrand(151)), "151 ans, c'est trop");
    }
}
