#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn echange_simple() {
        let mut x = 1;
        let mut y = 2;
        unsafe { echanger(&mut x, &mut y) };
        assert_eq!((x, y), (2, 1), "1 et 2 doivent être échangés");
    }

    #[test]
    fn echange_deux_fois() {
        let mut x = -5;
        let mut y = 40;
        unsafe {
            echanger(&mut x, &mut y);
            echanger(&mut x, &mut y);
        }
        assert_eq!((x, y), (-5, 40), "deux échanges redonnent les valeurs de départ");
    }
}
