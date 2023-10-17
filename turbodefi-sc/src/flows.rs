multiversx_sc::imports!();
multiversx_sc::derive_imports!();

use crate::{flow::Flow, operator, td_endpoints};

#[multiversx_sc::module]
pub trait FlowsModule: operator::OperatorModule + td_endpoints::TdEndpointsModule {
    #[endpoint(addFlow)]
    fn add_flow(&self, name: ManagedBuffer, label: ManagedBuffer, description: ManagedBuffer) {
        require!(!name.is_empty(), "name parameter is mandatory!");
        require!(!label.is_empty(), "label parameter is mandatory!");
        require!(
            !description.is_empty(),
            "description parameter is mandatory!"
        );

        let flow_id = &self.increase_last_flow_id();
        let caller = &self.blockchain().get_caller();
        let flow = Flow::new(flow_id.clone(), caller.clone(), name, label, description);

        self.flow_by_id(flow_id).set(flow);
        self.address_flows_ids(caller).push(flow_id);
    }

    #[view(getAddressFlows)]
    fn get_address_flows(&self, address: &ManagedAddress) -> MultiValueEncoded<Flow<Self::Api>> {
        let mut flows = MultiValueEncoded::new();

        for flow_id in self.address_flows_ids(address).iter() {
            let flow = self.flow_by_id(&flow_id).get();
            for mut step in flow.steps.iter() {
                for endpoint_id in step.endpoints_ids.iter() {
                    step.endpoints.push(self.endpoint_by_id(endpoint_id).get());
                }
            }
            flows.push(flow);
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

    fn increase_last_flow_id(&self) -> u64 {
        self.last_flow_id().update(|last_id| *last_id += 1);

        self.last_flow_id().get()
    }

    fn validate_flow_exists(&self, flow_id: &u64) {
        require!(
            !self.flow_by_id(flow_id).is_empty(),
            "doesn't exist flow with id: {}!",
            flow_id
        );
    }

    fn validate_flow_creator(&self, flow: &Flow<Self::Api>) {
        let caller = &self.blockchain().get_caller();
        require!(
            flow.creator == caller.clone(),
            "address not allowed to modify flow!"
        );
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
