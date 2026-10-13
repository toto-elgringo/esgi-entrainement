#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn nombres_simples() {
        assert_eq!(fizz_buzz(1), "1", "1 n'est multiple ni de 3 ni de 5");
        assert_eq!(fizz_buzz(98), "98", "98 n'est multiple ni de 3 ni de 5");
    }

    #[test]
    fn fizz_et_buzz() {
        assert_eq!(fizz_buzz(3), "Fizz", "3 est multiple de 3");
        assert_eq!(fizz_buzz(9), "Fizz", "9 est multiple de 3");
        assert_eq!(fizz_buzz(5), "Buzz", "5 est multiple de 5");
        assert_eq!(fizz_buzz(10), "Buzz", "10 est multiple de 5");
    }

    #[test]
    fn fizzbuzz() {
        assert_eq!(fizz_buzz(15), "FizzBuzz", "15 est multiple de 3 et de 5");
        assert_eq!(fizz_buzz(30), "FizzBuzz", "30 est multiple de 3 et de 5");
    }
}
