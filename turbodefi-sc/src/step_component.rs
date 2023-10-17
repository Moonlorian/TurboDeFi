use crate::{components, flows, operator, td_endpoints};

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait StepComponentModule:
    operator::OperatorModule
    + flows::FlowsModule
    + td_endpoints::TdEndpointsModule
    + components::ComponentsModule
{
    #[endpoint(addStepComponent)]
    fn add_step_component(&self, flow_id: &u64, step_index: usize, component_id: u64) {
        require!(flow_id.clone() != 0, "flow_id parameter is mandatory!");
        require!(component_id != 0, "component_id parameter is mandatory!");
        self.validate_flow_exists(flow_id);

        let mut flow = self.flow_by_id(flow_id).get();
        require!(step_index < flow.steps.len(), "invalid step_index!");
        require!(
            !self.component_by_id(component_id).is_empty(),
            "component_id doesn't exist!"
        );
        self.validate_flow_creator(&flow);
        require!(
            flow.steps.get(step_index).endpoints_ids.is_empty(),
            "step has endpoints already!"
        );

        let mut step = flow.steps.get(step_index);
        step.set_component(component_id);
        let _ = flow.steps.set(step_index, &step);
        self.flow_by_id(flow_id).set(flow);
    }
}
