#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trois_producteurs() {
        assert_eq!(collecter(3, 2), vec![0, 1, 100, 101, 200, 201], "tous les messages sont reçus et triés");
    }

    #[test]
    fn un_producteur() {
        assert_eq!(collecter(1, 3), vec![0, 1, 2], "un seul producteur");
    }

    #[test]
    fn aucun_producteur() {
        assert_eq!(collecter(0, 5), Vec::<u32>::new(), "sans producteur, la liste est vide");
    }

    #[test]
    fn beaucoup_de_messages() {
        let resultat = collecter(8, 200);
        assert_eq!(resultat.len(), 1600, "8 producteurs x 200 messages");
        assert_eq!(resultat[0], 0, "le plus petit message");
        assert_eq!(resultat[1599], 899,"le plus grand message");
    }
}
