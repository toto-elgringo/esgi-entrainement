#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trois_valeurs() {
        assert_eq!(chaine(vec![1, 2, 3], 2), vec![2, 4, 6], "chaque valeur est doublée, dans l'ordre");
    }

    #[test]
    fn capacite_zero() {
        assert_eq!(chaine(vec![5, -1], 0), vec![10, -2], "un canal de taille 0 fonctionne aussi");
    }

    #[test]
    fn liste_vide() {
        assert_eq!(chaine(vec![], 3), Vec::<i64>::new(), "rien à envoyer, rien à recevoir");
    }

    #[test]
    fn beaucoup_plus_que_la_capacite() {
        let valeurs: Vec<i64> = (0..1000).collect();
        let attendu: Vec<i64> = (0..1000).map(|v| v * 2).collect();
        assert_eq!(chaine(valeurs, 1), attendu, "1000 valeurs passent par un canal de taille 1");
    }
}
