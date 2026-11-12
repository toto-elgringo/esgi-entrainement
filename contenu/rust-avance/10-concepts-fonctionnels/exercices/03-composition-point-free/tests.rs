#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn composition_simple() {
        let f = composer(|x: i32| x + 1, |x| x * 2);
        assert_eq!(f(5), 12, "(5 + 1) * 2 vaut 12");
    }

    #[test]
    fn ordre_des_fonctions() {
        let f = composer(|x: i32| x * 2, |x| x + 1);
        assert_eq!(f(5), 11, "f d'abord, puis g : 5 * 2 + 1 vaut 11");
    }

    #[test]
    fn types_differents() {
        let f = composer(|s: String| s.len(), |n| n * 2);
        assert_eq!(f(String::from("abc")), 6, "longueur 3, puis doublée");
    }

    #[test]
    fn point_free_negatif() {
        assert_eq!(abs_puis_double()(-7), 14, "|-7| * 2 vaut 14");
    }

    #[test]
    fn point_free_positif() {
        assert_eq!(abs_puis_double()(4), 8, "|4| * 2 vaut 8");
    }
}
