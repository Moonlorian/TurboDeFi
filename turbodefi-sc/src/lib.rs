#![no_std]

mod td_endpoint;
mod operator;
mod td_endpoints;

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait TurbodefiContract: operator::OperatorModule + td_endpoints::TdEndpointsModule {
    #[init]
    fn init(&self) {
        self.last_endpoint_id().set_if_empty(0);
    }
}
