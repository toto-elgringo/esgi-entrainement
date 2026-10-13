#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn variantes() {
        assert_eq!(fizz_buzz(1), FizzBuzz::Nombre(1), "1 donne Nombre(1)");
        assert_eq!(fizz_buzz(7), FizzBuzz::Nombre(7), "7 donne Nombre(7)");
        assert_eq!(fizz_buzz(3), FizzBuzz::Fizz, "3 donne Fizz");
        assert_eq!(fizz_buzz(10), FizzBuzz::Buzz, "10 donne Buzz");
        assert_eq!(fizz_buzz(15), FizzBuzz::FizzBuzz, "15 donne FizzBuzz");
        assert_eq!(fizz_buzz(30), FizzBuzz::FizzBuzz, "30 donne FizzBuzz");
    }

    #[test]
    fn texte() {
        assert_eq!(en_texte(&FizzBuzz::Fizz), "Fizz", "Fizz s'écrit \"Fizz\"");
        assert_eq!(en_texte(&FizzBuzz::Buzz), "Buzz", "Buzz s'écrit \"Buzz\"");
        assert_eq!(en_texte(&FizzBuzz::FizzBuzz), "FizzBuzz", "FizzBuzz s'écrit \"FizzBuzz\"");
        assert_eq!(en_texte(&FizzBuzz::Nombre(42)), "42", "Nombre(42) s'écrit \"42\"");
    }
}
