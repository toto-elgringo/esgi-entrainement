#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn multiplication() {
        let triple = fixer_premier(|a: i32, b: i32| a * b, 3);
        assert_eq!(triple(5), 15, "3 fixé, puis 5 : 15");
    }

    #[test]
    fn plusieurs_appels() {
        let plus_dix = fixer_premier(|a: i32, b: i32| a + b, 10);
        assert_eq!(plus_dix(1) + plus_dix(2), 23, "la fonction renvoyée sert plusieurs fois");
    }

    #[test]
    fn texte() {
        let saluer = |formule: &str, nom: &str| format!("{formule}, {nom} !");
        let bonjour = fixer_premier(saluer, "Bonjour");
        assert_eq!(bonjour("Ada"), "Bonjour, Ada !", "le texte fixé est repris");
    }

    #[test]
    fn type_different_en_sortie() {
        let repeter = fixer_premier(|mot: String, n: usize| mot.repeat(n), String::from("ab"));
        assert_eq!(repeter(3), "ababab", "A = String, B = usize, C = String");
    }
}
