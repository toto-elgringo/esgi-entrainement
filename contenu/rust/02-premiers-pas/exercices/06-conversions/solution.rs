fn additionner(petit: u8, grand: u32) -> u32 {
    u32::from(petit) + grand
}

fn vers_u8(n: u32) -> Option<u8> {
    u8::try_from(n).ok()
}

fn garder_octet_bas(n: u32) -> u8 {
    n as u8
}

fn main() {
    println!("{}", additionner(200, 100_000));
    println!("{:?}", vers_u8(300));
    println!("{}", garder_octet_bas(300));
}
