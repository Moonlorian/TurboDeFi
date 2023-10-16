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
        self.address_flows_ids(caller).push(flow_id);
    }

    #[view(getAddressFlows)]
    fn get_address_flows(&self, address: &ManagedAddress) -> MultiValueEncoded<Flow<Self::Api>> {
        let mut flows = MultiValueEncoded::new();

        for flow_id in self.address_flows_ids(address).iter() {
            flows.push(self.flow_by_id(&flow_id).get());
        }

        return flows;
    }

    #[view(getFlowByAddressAndName)]
    fn get_flow_by_name(
        &self,
        address: &ManagedAddress,
        flow_name: ManagedBuffer,
    ) -> Flow<Self::Api> {
        for flow_id in self.address_flows_ids(address).iter() {
            let flow = self.flow_by_id(&flow_id).get();
            if flow_name == flow.name {
                return flow;
            }
        }

        panic!("flow not found!");
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

    #[view(getAddressFlowsIds)]
    #[storage_mapper("address_flows")]
    fn address_flows_ids(&self, address: &ManagedAddress) -> VecMapper<u64>;
}
