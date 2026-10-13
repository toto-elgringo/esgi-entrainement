#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deux_textes() {
        assert_eq!(plus_long("bonjour", "salut"), "bonjour", "bonjour est plus long que salut");
        assert_eq!(plus_long("a", "abc"), "abc", "abc est plus long que a");
    }

    #[test]
    fn egalite() {
        assert_eq!(plus_long("abc", "xyz"), "abc", "en cas d'égalité, on renvoie le premier");
    }

    #[test]
    fn avec_des_string() {
        let premier = String::from("crabe");
        let second = String::from("homard");
        assert_eq!(plus_long(&premier, &second), "homard", "fonctionne avec des String empruntées");
    }

    #[test]
    fn trois_textes() {
        assert_eq!(plus_long_de_trois("un", "trois", "deux"), "trois", "trois est le plus long");
        assert_eq!(plus_long_de_trois("a", "b", "ccc"), "ccc", "ccc est le plus long");
        assert_eq!(plus_long_de_trois("aa", "bb", "cc"), "aa", "en cas d'égalité, on renvoie le premier");
    }
}
