#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn premiers_appels() {
        let mut c = compteur(10, 5);
        assert_eq!(c(), 10, "le premier appel donne le départ");
        assert_eq!(c(), 15, "le deuxième ajoute le pas");
        assert_eq!(c(), 20, "le troisième ajoute encore le pas");
    }

    #[test]
    fn pas_negatif() {
        let mut c = compteur(3, -1);
        assert_eq!(c(), 3, "départ 3");
        assert_eq!(c(), 2, "puis 2");
        assert_eq!(c(), 1, "puis 1");
    }

    #[test]
    fn compteurs_independants() {
        let mut a = compteur(0, 1);
        let mut b = compteur(100, 10);
        assert_eq!(a(), 0, "a démarre à 0");
        assert_eq!(a(), 1, "a avance de 1");
        assert_eq!(b(), 100, "b n'est pas touché par a");
        assert_eq!(a(), 2, "a continue sa suite");
        assert_eq!(b(), 110, "b avance de 10");
    }
}
