use std::ffi::{CString, c_char, c_int};

unsafe extern "C" {
    safe fn abs(x: c_int) -> c_int;
    fn strlen(s: *const c_char) -> usize;
}

fn valeur_absolue(x: i32) -> i32 {
    abs(x)
}

fn longueur_c(texte: &str) -> usize {
    let c = CString::new(texte).expect("le texte ne doit pas contenir de zéro");
    unsafe { strlen(c.as_ptr()) }
}

fn main() {
    println!("{}", valeur_absolue(-7));
    println!("{}", longueur_c("bonjour"));
}
