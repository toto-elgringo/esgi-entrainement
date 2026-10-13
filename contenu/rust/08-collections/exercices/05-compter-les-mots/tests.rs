#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn phrase_simple() {
        let compteur = compter_mots("le chat et le chien");
        assert_eq!(compteur.len(), 4, "4 mots différents : le, chat, et, chien");
        assert_eq!(compteur.get("le"), Some(&2), "« le » apparaît 2 fois");
        assert_eq!(compteur.get("chat"), Some(&1), "« chat » apparaît 1 fois");
    }

    #[test]
    fn majuscules_ignorees() {
        let compteur = compter_mots("Le LE le");
        assert_eq!(compteur.len(), 1, "Le, LE et le sont le même mot");
        assert_eq!(compteur.get("le"), Some(&3), "« le » apparaît 3 fois (en minuscules)");
    }

    #[test]
    fn texte_vide() {
        assert!(compter_mots("").is_empty(), "un texte vide ne contient aucun mot");
        assert!(compter_mots("   ").is_empty(), "des espaces seuls ne forment aucun mot");
    }

    #[test]
    fn nombre_d_apparitions() {
        let compteur = compter_mots("un deux deux trois trois trois");
        assert_eq!(nombre_de(&compteur, "trois"), 3, "« trois » apparaît 3 fois");
        assert_eq!(nombre_de(&compteur, "un"), 1, "« un » apparaît 1 fois");
        assert_eq!(nombre_de(&compteur, "quatre"), 0, "« quatre » n'apparaît pas : 0");
    }
}
