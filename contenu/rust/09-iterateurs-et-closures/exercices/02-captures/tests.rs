#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trois_appels() {
        assert_eq!(compter_appels(), 3, "la closure est appelée 3 fois : le compteur vaut 3");
    }

    #[test]
    fn salutation() {
        let saluer = creer_salutation("Ana".to_string());
        assert_eq!(saluer(), "Bonjour Ana !", "la closure salue Ana");
        assert_eq!(saluer(), "Bonjour Ana !", "on peut l'appeler plusieurs fois");
    }

    #[test]
    fn deux_salutations_independantes() {
        let saluer_leo = creer_salutation("Léo".to_string());
        let saluer_mia = creer_salutation("Mia".to_string());
        assert_eq!(saluer_leo(), "Bonjour Léo !", "chaque closure garde son propre nom");
        assert_eq!(saluer_mia(), "Bonjour Mia !", "chaque closure garde son propre nom");
    }
}
