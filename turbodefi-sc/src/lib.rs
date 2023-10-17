#![no_std]

mod components;
mod flow;
mod flow_step;
mod flows;
mod operator;
mod step_endpoint;
mod td_endpoint;
mod td_endpoints;

multiversx_sc::imports!();

#[multiversx_sc::contract]
pub trait TurbodefiContract:
    operator::OperatorModule
    + td_endpoints::TdEndpointsModule
    + flows::FlowsModule
    + flow_step::FlowStepModule
    + step_endpoint::StepEndpointModule
    + components::ComponentsModule
{
    #[init]
    fn init(&self) {
        self.last_endpoint_id().set_if_empty(0);
    }
}
