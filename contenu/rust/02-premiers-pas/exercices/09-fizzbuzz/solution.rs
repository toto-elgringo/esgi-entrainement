fn fizz_buzz(n: u32) -> String {
    match n {
        i if i % 15 == 0 => "FizzBuzz".to_string(),
        i if i % 3 == 0 => "Fizz".to_string(),
        i if i % 5 == 0 => "Buzz".to_string(),
        i => i.to_string(),
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", fizz_buzz(i));
    }
}
