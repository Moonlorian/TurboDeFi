multiversx_sc::imports!();

use crate::{flow::Flow, operator};

#[multiversx_sc::module]
pub trait FlowsModule: operator::OperatorModule {
    #[endpoint(addFlow)]
    fn add_flow(&self, name: ManagedBuffer, label: ManagedBuffer, description: ManagedBuffer) {
        require!(!name.is_empty(), "name parameter is mandatory!");
        require!(!label.is_empty(), "label parameter is mandatory!");
        require!(
            !description.is_empty(),
            "description parameter is mandatory!"
        );

        let caller = &self.blockchain().get_caller();
        let flow = Flow::new(caller.clone(), name, label, description);

        self.increase_last_flow_id();
        let flow_id = &self.last_flow_id().get();
        self.flow_by_id(flow_id).set(flow);
        self.address_flows(caller).push(flow_id);
    }

    fn increase_last_flow_id(&self) {
        self.last_flow_id().update(|last_id| *last_id += 1);
    }

    #[view(getLastFlowId)]
    #[storage_mapper("last_flow_id")]
    fn last_flow_id(&self) -> SingleValueMapper<u64>;

    #[view(getFlowById)]
    #[storage_mapper("flow_by_id")]
    fn flow_by_id(&self, id: &u64) -> SingleValueMapper<Flow<Self::Api>>;

    #[view(getAddressFlows)]
    #[storage_mapper("address_flows")]
    fn address_flows(&self, address: &ManagedAddress) -> VecMapper<u64>;
}
