trait Pipe: Sized {
    fn pipe<R>(self, f: impl FnOnce(Self) -> R) -> R {
        todo!()
    }
}

impl<T> Pipe for T {}

fn etiquette(texte: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", 5.pipe(|x| x + 1).pipe(|x| x * 2));
    println!("{}", etiquette("  rust "));
}
