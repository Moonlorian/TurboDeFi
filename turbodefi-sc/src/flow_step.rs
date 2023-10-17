multiversx_sc::imports!();

use crate::{flows, operator, td_endpoints};

#[multiversx_sc::module]
pub trait FlowStepModule: operator::OperatorModule + flows::FlowsModule + td_endpoints::TdEndpointsModule {
    #[endpoint(addFlowStep)]
    fn add_flow_step(&self, flow_id: &u64, description: ManagedBuffer) {
        require!(flow_id.clone() != 0, "flow_id parameter is mandatory!");
        require!(
            !description.is_empty(),
            "description parameter is mandatory!"
        );
        self.validate_flow_exists(flow_id);

        let mut flow = self.flow_by_id(flow_id).get();
        self.validate_flow_creator(&flow);

        flow.add_step(description);
        self.flow_by_id(flow_id).set(flow);
    }
}
