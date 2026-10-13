#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ordre_des_couleurs() {
        assert_eq!(suivant(Feu::Vert), Feu::Orange, "après le vert vient l'orange");
        assert_eq!(suivant(Feu::Orange), Feu::Rouge, "après l'orange vient le rouge");
        assert_eq!(suivant(Feu::Rouge), Feu::Vert, "après le rouge vient le vert");
    }

    #[test]
    fn passage() {
        assert!(peut_passer(&Feu::Vert), "on passe au vert");
        assert!(!peut_passer(&Feu::Orange), "on ne passe pas à l'orange");
        assert!(!peut_passer(&Feu::Rouge), "on ne passe pas au rouge");
    }
}
