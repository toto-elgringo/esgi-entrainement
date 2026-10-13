#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn indice_existant() {
        assert_eq!(element_ou_zero(&[10, 20, 30], 0), 10, "l'indice 0 contient 10");
        assert_eq!(element_ou_zero(&[10, 20, 30], 1), 20, "l'indice 1 contient 20");
    }

    #[test]
    fn indice_trop_grand() {
        assert_eq!(element_ou_zero(&[10, 20, 30], 3), 0, "l'indice 3 n'existe pas : 0 attendu");
        assert_eq!(element_ou_zero(&[], 0), 0, "une liste vide n'a aucun indice : 0 attendu");
    }

    #[test]
    fn premier_et_dernier_normal() {
        assert_eq!(premier_et_dernier(&[5, 6, 7]), Some((5, 7)), "premier 5, dernier 7");
        assert_eq!(premier_et_dernier(&[9]), Some((9, 9)), "un seul élément : il est premier et dernier");
    }

    #[test]
    fn premier_et_dernier_vide() {
        assert_eq!(premier_et_dernier(&[]), None, "une liste vide n'a ni premier ni dernier");
    }
}
