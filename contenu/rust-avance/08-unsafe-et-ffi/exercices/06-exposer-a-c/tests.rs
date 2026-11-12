#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn somme() {
        assert_eq!(additionner(2, 3), 5, "2 + 3 = 5");
        assert_eq!(additionner(-4, 4), 0, "-4 + 4 = 0");
    }

    #[test]
    fn distance() {
        assert_eq!(distance_carree(Point { x: 3, y: 4 }), 25, "3² + 4² = 25");
        assert_eq!(distance_carree(Point { x: 0, y: 0 }), 0, "l'origine est à distance 0");
    }

    #[test]
    fn signature_c() {
        let f: extern "C" fn(i32, i32) -> i32 = additionner;
        assert_eq!(f(1, 1), 2, "additionner doit être une fonction extern C");
        let g: extern "C" fn(Point) -> i32 = distance_carree;
        assert_eq!(g(Point { x: 1, y: 2 }), 5, "distance_carree doit être une fonction extern C");
    }

    #[test]
    fn disposition_c() {
        assert_eq!(std::mem::size_of::<Point>(), 8, "Point fait deux i32");
        let p = Point { x: 1, y: 2 };
        let base = &p as *const Point as usize;
        let adresse_y = &p.y as *const i32 as usize;
        assert_eq!(adresse_y - base, 4, "avec #[repr(C)], y vient juste après x");
    }
}
