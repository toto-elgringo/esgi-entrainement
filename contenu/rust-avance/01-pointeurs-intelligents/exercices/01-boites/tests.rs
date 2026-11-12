#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn boite_simple() {
        assert_eq!(*envelopper(7), 7, "la boîte contient 7");
        let mut boite = envelopper(1);
        incrementer(&mut boite);
        assert_eq!(*boite, 2, "incrementer ajoute 1 à la valeur de la boîte");
    }

    #[test]
    fn somme_de_boites() {
        assert_eq!(*additionner(&2, &3), 5, "2 + 3");
        assert_eq!(*additionner(&envelopper(-4), &envelopper(4)), 0, "-4 + 4");
    }

    #[test]
    fn operations() {
        let double = choisir_operation("double").expect("« double » existe");
        assert_eq!(double(21), 42, "le double de 21");
        let carre = choisir_operation("carre").expect("« carre » existe");
        assert_eq!(carre(-5), 25, "le carré de -5");
        let oppose = choisir_operation("oppose").expect("« oppose » existe");
        assert_eq!(oppose(8), -8, "l'opposé de 8");
    }

    #[test]
    fn operation_inconnue() {
        assert!(choisir_operation("racine").is_none(), "un nom inconnu donne None");
    }
}
