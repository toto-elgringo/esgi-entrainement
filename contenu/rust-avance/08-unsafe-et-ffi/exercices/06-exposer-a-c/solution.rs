#[repr(C)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

#[unsafe(no_mangle)]
pub extern "C" fn additionner(a: i32, b: i32) -> i32 {
    a + b
}

#[unsafe(no_mangle)]
pub extern "C" fn distance_carree(p: Point) -> i32 {
    p.x * p.x + p.y * p.y
}

fn main() {
    println!("{}", additionner(2, 3));
    println!("{}", distance_carree(Point { x: 3, y: 4 }));
}
