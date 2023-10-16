multiversx_sc::imports!();

use crate::{flows, operator, td_endpoints};

#[multiversx_sc::module]
pub trait StepEndpointModule:
    operator::OperatorModule + flows::FlowsModule + td_endpoints::TdEndpointsModule
{
    #[endpoint(addStepEndpoint)]
    fn add_step_endpoints(&self, flow_id: &u64, step_index: usize, endpoints_ids: ManagedVec<u64>) {
        require!(flow_id.clone() != 0, "flow_id parameter is mandatory!");
        require!(step_index != 0, "step_index parameter is mandatory!");
        require!(
            !endpoints_ids.is_empty(),
            "endpoints_ids parameter is mandatory!"
        );
        require!(
            !self.flow_by_id(flow_id).is_empty(),
            "doesn't exist flow with id: {}!",
            flow_id
        );

        let flow = self.flow_by_id(flow_id).get();
        require!(step_index < flow.steps.len(), "invalid step_index!");

        for endpoint_id in endpoints_ids.iter() {
            require!(
                !self.endpoint_by_id(endpoint_id).is_empty(),
                "endpoint_id {} doesn't exist!",
                endpoint_id
            );
        }

        let caller = &self.blockchain().get_caller();
        require!(
            flow.creator == caller.clone(),
            "address not allowed to modify flow!"
        );
        
        flow.steps.get(step_index).add_endpoints_ids(endpoints_ids);
        self.flow_by_id(flow_id).set(flow);
    }
}
