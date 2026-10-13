fn diviser(a: u32, b: u32) -> u32 {
    if b == 0 {
        panic!("division par zéro");
    }
    a / b
}

fn main() {
    println!("7 / 2 = {}", diviser(7, 2));
}

#[cfg(test)]
mod mes_tests {
    use super::*;

    #[test]
    fn division_exacte() {
        assert_eq!(diviser(10, 2), 5);
    }

    #[test]
    fn division_avec_reste() {
        assert_eq!(diviser(7, 2), 3);
    }

    #[test]
    #[should_panic(expected = "division par zéro")]
    fn division_par_zero() {
        diviser(1, 0);
    }

    #[test]
    fn resultat_different_de_zero() {
        assert_ne!(diviser(9, 3), 0);
    }
}
