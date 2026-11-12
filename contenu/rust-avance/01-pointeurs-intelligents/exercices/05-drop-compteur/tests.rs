#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn jeton_vivant() {
        let compteur = Rc::new(Cell::new(0));
        let _jeton = Jeton::nouveau(&compteur);
        assert_eq!(compteur.get(), 0, "un jeton encore vivant n'est pas compté");
    }

    #[test]
    fn drop_explicite() {
        let compteur = Rc::new(Cell::new(0));
        let jeton = Jeton::nouveau(&compteur);
        drop(jeton);
        assert_eq!(compteur.get(), 1, "drop(jeton) libère le jeton");
    }

    #[test]
    fn fin_de_portee() {
        let compteur = Rc::new(Cell::new(0));
        {
            let _a = Jeton::nouveau(&compteur);
            let _b = Jeton::nouveau(&compteur);
        }
        assert_eq!(compteur.get(), 2, "deux jetons libérés à la fin du bloc");
    }

    #[test]
    fn boucle() {
        let compteur = Rc::new(Cell::new(0));
        creer_et_perdre(&compteur, 4);
        assert_eq!(compteur.get(), 4, "quatre jetons créés puis libérés");
        creer_et_perdre(&compteur, 0);
        assert_eq!(compteur.get(), 4, "zéro jeton : rien ne change");
    }

    #[test]
    fn dans_une_boite() {
        let compteur = Rc::new(Cell::new(0));
        let boite = Box::new(Jeton::nouveau(&compteur));
        assert_eq!(compteur.get(), 0, "la boîte garde le jeton");
        drop(boite);
        assert_eq!(compteur.get(), 1, "libérer la boîte libère le jeton");
    }
}
