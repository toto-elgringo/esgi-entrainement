#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn additionner() {
        let plus_cinq = additionneur(5);
        assert_eq!(plus_cinq(10), 15, "10 + 5 = 15");
        assert_eq!(plus_cinq(-5), 0, "-5 + 5 = 0");
        let plus_un = additionneur(1);
        assert_eq!(plus_un(plus_un(0)), 2, "on peut appeler plusieurs fois la même fonction");
    }

    #[test]
    fn multiplier() {
        assert_eq!(multiplicateur(3)(7), 21, "7 × 3 = 21");
        assert_eq!(multiplicateur(-2)(4), -8, "4 × -2 = -8");
        assert_eq!(multiplicateur(0)(42), 0, "tout nombre multiplié par 0 donne 0");
    }

    #[test]
    fn composer_dans_l_ordre() {
        let f = composer(additionneur(1), multiplicateur(10));
        assert_eq!(f(4), 50, "on ajoute 1 PUIS on multiplie par 10 : (4 + 1) × 10 = 50");
        let g = composer(multiplicateur(10), additionneur(1));
        assert_eq!(g(4), 41, "on multiplie par 10 PUIS on ajoute 1 : 4 × 10 + 1 = 41");
        let h = composer(|x| x - 3, |x| x * x);
        assert_eq!(h(5), 4, "(5 - 3) au carré = 4");
    }

    #[test]
    fn operations() {
        assert_eq!(operation('+')(2, 3), 5, "2 + 3 = 5");
        assert_eq!(operation('-')(7, 2), 5, "7 - 2 = 5");
        assert_eq!(operation('*')(6, 7), 42, "6 × 7 = 42");
        assert_eq!(operation('?')(6, 7), 0, "symbole inconnu : toujours 0");
    }

    #[test]
    fn enchainer_des_etapes() {
        let etapes: Vec<Box<dyn Fn(i32) -> i32>> = vec![
            Box::new(additionneur(1)),
            Box::new(multiplicateur(2)),
            Box::new(|x: i32| x - 3),
        ];
        assert_eq!(enchainer(etapes)(5), 9, "(5 + 1) × 2 - 3 = 9");
        assert_eq!(enchainer(Vec::new())(7), 7, "aucune étape : 7 ne change pas");
    }
}
