unsafe fn echanger(a: *mut i32, b: *mut i32) {
    unsafe {
        let temporaire = std::ptr::read(a);
        std::ptr::write(a, std::ptr::read(b));
        std::ptr::write(b, temporaire);
    }
}

fn main() {
    let mut x = 1;
    let mut y = 2;
    unsafe {
        echanger(&mut x, &mut y);
    }
    println!("{} {}", x, y);
}
