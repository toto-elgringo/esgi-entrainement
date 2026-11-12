use std::ffi::{CStr, CString, c_char};

unsafe fn depuis_c(p: *const c_char) -> String {
    unsafe { CStr::from_ptr(p) }.to_string_lossy().into_owned()
}

fn vers_c(texte: &str) -> Option<CString> {
    CString::new(texte).ok()
}

fn main() {
    let c = vers_c("salut").expect("texte valide");
    let retour = unsafe { depuis_c(c.as_ptr()) };
    println!("{}", retour);
}
