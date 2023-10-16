use crate::td_endpoint::TdEndpointType;

multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(ManagedVecItem, NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct ComponentProp<M: ManagedTypeApi> {
    pub default_token_from: EgldOrEsdtTokenIdentifier<M>,
}

#[derive(ManagedVecItem, NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct FlowStep<M: ManagedTypeApi> {
    pub description: ManagedBuffer<M>,
    pub component: u64,
    pub component_props: ManagedVec<M, ComponentProp<M>>,
    pub endpoints: ManagedVec<M, TdEndpointType<M>>,
}

impl<M: ManagedTypeApi> FlowStep<M> {
    pub fn new(description: ManagedBuffer<M>) -> Self {
        FlowStep {
            description,
            component: Default::default(),
            component_props: Default::default(),
            endpoints: Default::default(),
        }
    }
}

#[derive(ManagedVecItem, NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct Flow<M: ManagedTypeApi> {
    pub creator: ManagedAddress<M>,
    pub name: ManagedBuffer<M>,
    pub label: ManagedBuffer<M>,
    pub description: ManagedBuffer<M>,
    pub steps: ManagedVec<M, FlowStep<M>>,
}

impl<M: ManagedTypeApi> Flow<M> {
    pub fn new(
        creator: ManagedAddress<M>,
        name: ManagedBuffer<M>,
        label: ManagedBuffer<M>,
        description: ManagedBuffer<M>,
    ) -> Self {
        Flow {
            creator,
            name,
            label,
            description,
            steps: ManagedVec::new(),
        }
    }

    pub fn add_step(&mut self, description: ManagedBuffer<M>) {
        let step = FlowStep::new(description);
        self.steps.push(step);
    }
}
