use aztec::macros::aztec;

#[aztec]
contract Example {
    use aztec::macros::functions::{ public, view };

    #[public]
    #[view]
    fn double(x: Field) -> pub Field { x * 2 }

    #[public]
    #[view]
    fn triple(x: Field) -> pub Field { x * 3 }

    #[public]
    #[view]
    fn quadruple(x: Field) -> pub Field { double(double(x)) }
}
