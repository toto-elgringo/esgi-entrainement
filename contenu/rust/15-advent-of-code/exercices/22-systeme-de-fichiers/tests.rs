#[cfg(test)]
mod tests {
    use super::*;

    const IMBRIQUES: &str = "$ cd /\n$ ls\ndir a\n$ cd a\n$ ls\ndir b\n$ cd b\n$ ls\n1000 f.txt";

    const PILE_POIL: &str = "$ cd /\n$ ls\ndir a\ndir b\n39500000 gros.bin\n$ cd a\n$ ls\n500000 x.dat\n$ cd ..\n$ cd b\n$ ls\n1000000 y.dat";

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 201784, "docs (95657), docs/archives (42127) et jeux/archives (64000) font 201784");
    }

    #[test]
    fn partie1_fichier_compte_plusieurs_fois() {
        assert_eq!(partie1(IMBRIQUES), 3000, "le fichier de 1000 compte pour b, pour a et pour / : 3000");
    }

    #[test]
    fn partie1_rien_d_assez_petit() {
        assert_eq!(partie1("$ cd /\n$ ls\n200000 gros.bin"), 0, "aucun dossier ne fait 100000 ou moins");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), 9425215, "il faut libérer 5319372 : le plus petit dossier suffisant est musique (9425215)");
    }

    #[test]
    fn partie2_taille_juste_suffisante() {
        assert_eq!(partie2(PILE_POIL), 1000000, "il faut libérer exactement 1000000 : le dossier b de 1000000 suffit");
    }

    #[test]
    fn fins_de_ligne_windows() {
        let entree = EXEMPLE.replace('\n', "\r\n") + "\r\n";
        assert_eq!(partie1(&entree), 201784, "les fins de ligne Windows (\r\n) et la ligne vide finale sont gérées");
    }
}
