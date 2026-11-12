#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn journal_vide() {
        let j = Journal::nouveau();
        assert_eq!(j.nombre(), 0, "un journal neuf est vide");
        assert_eq!(j.derniere(), None, "pas de dernière ligne dans un journal vide");
    }

    #[test]
    fn ecrire_ajoute_des_lignes() {
        let j = Journal::nouveau();
        j.ecrire("a");
        j.ecrire("b");
        assert_eq!(j.nombre(), 2, "deux lignes écrites");
    }

    #[test]
    fn derniere_ligne() {
        let j = Journal::nouveau();
        j.ecrire("a");
        j.ecrire("b");
        assert_eq!(j.derniere(), Some("b".to_string()), "la dernière ligne écrite");
        j.ecrire("c");
        assert_eq!(j.derniere(), Some("c".to_string()), "la dernière ligne change");
    }
}
