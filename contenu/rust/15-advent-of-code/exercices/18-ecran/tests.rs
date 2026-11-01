#[cfg(test)]
mod tests {
    use super::*;

    const ECRAN_EXEMPLE: &str = "###..###..####.#..#...##..##..#..#.####.
#..#..#...#....##.#....#.#..#.#..#.#....
###...#...###..##.#....#.#..#.#..#.###..
#..#..#...#....#.##....#.#..#.#..#.#....
#..#..#...#....#.##.#..#.#..#.#..#.#....
###..###..####.#..#..##...##...##..####.";

    #[test]
    fn partie1_exemple() {
        assert_eq!(partie1(EXEMPLE), 15280, "la somme des forces du signal de l'exemple vaut 15280");
    }

    #[test]
    fn partie2_exemple() {
        assert_eq!(partie2(EXEMPLE), ECRAN_EXEMPLE, "l'écran de l'exemple affiche BIENJOUE (6 lignes de 40 caractères)");
    }

    #[test]
    fn que_des_noop() {
        let programme = "noop\n".repeat(240);
        assert_eq!(partie1(&programme), 720, "X reste à 1 : 20 + 60 + 100 + 140 + 180 + 220 = 720");
        let ligne = format!("###{}", ".".repeat(37));
        assert_eq!(
            partie2(&programme),
            vec![ligne; 6].join("\n"),
            "X reste à 1 : seuls les pixels 0, 1 et 2 de chaque ligne sont allumés"
        );
    }

    #[test]
    fn addx_finit_apres_deux_cycles() {
        let programme = format!("{}addx 5\n{}", "noop\n".repeat(18), "noop\n".repeat(200));
        assert_eq!(
            partie1(&programme),
            4220,
            "addx 5 occupe les cycles 19 et 20 : X vaut encore 1 pendant le cycle 20, puis 6 ensuite"
        );
    }

    #[test]
    fn fins_de_ligne_windows() {
        let programme = "noop\r\n".repeat(220);
        assert_eq!(partie1(&programme), 720, "les fins de ligne Windows (\r\n) sont gérées");
    }
}
