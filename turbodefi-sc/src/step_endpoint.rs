multiversx_sc::imports!();

use crate::{flows, operator, td_endpoints};

#[multiversx_sc::module]
pub trait StepEndpointModule:
    operator::OperatorModule + flows::FlowsModule + td_endpoints::TdEndpointsModule
{
    #[endpoint(addStepEndpoints)]
    fn add_step_endpoints(&self, flow_id: &u64, step_index: usize, endpoints_ids: ManagedVec<u64>) {
        require!(flow_id.clone() != 0, "flow_id parameter is mandatory!");
        require!(
            !endpoints_ids.is_empty(),
            "endpoints_ids parameter is mandatory!"
        );
        self.validate_flow_exists(flow_id);

        let flow = self.flow_by_id(flow_id).get();
        require!(step_index < flow.steps.len(), "invalid step_index!");

        require!(
            flow.steps.get(step_index).component == 0,
            "step has component already!"
        );

        for endpoint_id in endpoints_ids.iter() {
            self.validate_endpoint_not_exists(endpoint_id);
        }
        self.validate_flow_creator(&flow);

        flow.steps.get(step_index).add_endpoints_ids(endpoints_ids);
        self.flow_by_id(flow_id).set(flow);
    }

    #[endpoint(addStepEndpoint)]
    fn add_step_endpoint(&self, flow_id: &u64, step_index: usize, endpoint_id: u64) {
        let mut endpoints_ids = ManagedVec::new();
        endpoints_ids.push(endpoint_id);
        self.add_step_endpoints(flow_id, step_index, endpoints_ids);
    }
}
