use std::ffi::{CString, c_char, c_int};

unsafe extern "C" {
    safe fn abs(x: c_int) -> c_int;
    fn strlen(s: *const c_char) -> usize;
}

fn valeur_absolue(x: i32) -> i32 {
    todo!()
}

fn longueur_c(texte: &str) -> usize {
    todo!()
}

fn main() {
    println!("{}", valeur_absolue(-7));
    println!("{}", longueur_c("bonjour"));
}
