#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 27591, "les 5 lignes corrompues de l'exemple valent 3 + 57 + 1197 + 1197 + 25137");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 33, "le score du milieu parmi 4, 23, 33, 36 et 556 est 33");
    }

    #[test]
    fn seul_le_premier_mauvais_fermant_compte() {
        assert_eq!(partie1("(]>"), 57, "seul le premier fermant incorrect compte : ici « ] »");
    }

    #[test]
    fn ligne_complete_ignoree() {
        assert_eq!(partie1("()[]{<>}"), 0, "une ligne complète n'est pas corrompue");
        assert_eq!(partie2("()[]{<>}\n(("), 6, "une ligne complète n'est pas incomplète : seul « (( » compte");
    }

    #[test]
    fn score_de_completion() {
        assert_eq!(partie2("<[(("), 164, "« <[(( » se complète par « ))]> » : 1, puis 6, 32 et 164");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = "(]\r\n((\r\n";
        assert_eq!(partie1(entree), 57, "les fins de ligne Windows (\r\n) sont gérées");
        assert_eq!(partie2(entree), 6, "« (( » se complète par « )) » : 1 puis 6");
    }
}
