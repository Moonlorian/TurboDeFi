multiversx_sc::imports!();

use crate::{flows, operator};

#[multiversx_sc::module]
pub trait FlowStepModule: operator::OperatorModule + flows::FlowsModule {
    #[endpoint(addFlowStep)]
    fn add_flow_step(&self, flow_id: &u64, description: ManagedBuffer) {
        require!(flow_id.clone() != 0, "flow_id parameter is mandatory!");
        require!(
            !description.is_empty(),
            "description parameter is mandatory!"
        );
        require!(
            !self.flow_by_id(flow_id).is_empty(),
            "doesn't exist flow with id: {}!",
            flow_id
        );
        let caller = &self.blockchain().get_caller();
        let mut flow = self.flow_by_id(flow_id).get();
        require!(
            flow.creator == caller.clone(),
            "address not allowed to modify flow!"
        );

        flow.add_step(description);
        self.flow_by_id(flow_id).set(flow);
    }
}
