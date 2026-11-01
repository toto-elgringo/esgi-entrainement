#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 7, "7 dessins sur 9 sont réalisables (grub et bbw sont impossibles)");
    }

    #[test]
    fn partie1_motif_reutilise() {
        assert_eq!(partie1("u, gb\n\nuuuu\ngbgbu\nbg"), 2, "un motif peut servir plusieurs fois, mais bg est impossible");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 14, "les 9 dessins de l'exemple se font de 14 façons au total");
    }

    #[test]
    fn partie2_petits_et_grands_motifs() {
        assert_eq!(partie2("r, rr\n\nrrrr"), 5, "rrrr se fait de 5 façons avec r et rr");
    }

    #[test]
    fn partie2_tres_long() {
        let entree = format!("w, ww\n\n{}", "w".repeat(80));
        assert_eq!(partie2(&entree), 37889062373143906, "80 w à la suite se font de 37889062373143906 façons : pense à u64 et ne liste pas les façons une par une");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie2(&entree), 14, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
