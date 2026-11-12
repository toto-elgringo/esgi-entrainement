unsafe fn echanger(a: *mut i32, b: *mut i32) {
    todo!()
}

fn main() {
    let mut x = 1;
    let mut y = 2;
    unsafe {
        echanger(&mut x, &mut y);
    }
    println!("{} {}", x, y);
}
