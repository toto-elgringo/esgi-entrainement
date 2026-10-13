fn diviser(a: u32, b: u32) -> u32 {
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
        assert_eq!(diviser(7, 2), 3.5);
    }

    #[test]
    fn division_par_zero() {
        diviser(1, 0);
    }
}
