use std::ffi::{CStr, CString, c_char};

unsafe fn depuis_c(p: *const c_char) -> String {
    todo!()
}

fn vers_c(texte: &str) -> Option<CString> {
    todo!()
}

fn main() {
    let c = vers_c("salut").expect("texte valide");
    let retour = unsafe { depuis_c(c.as_ptr()) };
    println!("{}", retour);
}
