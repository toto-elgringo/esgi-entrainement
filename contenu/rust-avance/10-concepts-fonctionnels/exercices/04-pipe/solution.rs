trait Pipe: Sized {
    fn pipe<R>(self, f: impl FnOnce(Self) -> R) -> R {
        f(self)
    }
}

impl<T> Pipe for T {}

fn etiquette(texte: &str) -> String {
    texte
        .pipe(str::trim)
        .pipe(str::to_uppercase)
        .pipe(|s| format!("<{s}>"))
}

fn main() {
    println!("{}", 5.pipe(|x| x + 1).pipe(|x| x * 2));
    println!("{}", etiquette("  rust "));
}
