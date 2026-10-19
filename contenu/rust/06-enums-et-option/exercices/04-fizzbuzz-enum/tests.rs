#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn variantes() {
        assert_eq!(fizz_buzz(1), Reponse::Nombre(1), "1 donne Nombre(1)");
        assert_eq!(fizz_buzz(7), Reponse::Nombre(7), "7 donne Nombre(7)");
        assert_eq!(fizz_buzz(3), Reponse::Fizz, "3 donne Fizz");
        assert_eq!(fizz_buzz(10), Reponse::Buzz, "10 donne Buzz");
        assert_eq!(fizz_buzz(15), Reponse::FizzBuzz, "15 donne FizzBuzz");
        assert_eq!(fizz_buzz(30), Reponse::FizzBuzz, "30 donne FizzBuzz");
    }

    #[test]
    fn texte() {
        assert_eq!(en_texte(&Reponse::Fizz), "Fizz", "Fizz s'écrit \"Fizz\"");
        assert_eq!(en_texte(&Reponse::Buzz), "Buzz", "Buzz s'écrit \"Buzz\"");
        assert_eq!(en_texte(&Reponse::FizzBuzz), "FizzBuzz", "FizzBuzz s'écrit \"FizzBuzz\"");
        assert_eq!(en_texte(&Reponse::Nombre(42)), "42", "Nombre(42) s'écrit \"42\"");
    }
}
