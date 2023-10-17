use crate::operator;

multiversx_sc::imports!();

#[multiversx_sc::module]
pub trait ComponentsModule: operator::OperatorModule {
    #[endpoint(addComponent)]
    fn add_component(&self, name: &ManagedBuffer) {
        self.validate_owner_or_operator();
        require!(!name.is_empty(), "name parameter is mandatory!");
        let id = self.component_id(name).get();
        require!(id == 0, "component already exists with id: {}!", id);

        let component_id = self.increase_last_component_id();
        self.component_by_id(component_id).set(name);
        self.component_id(name).set(component_id);
    }

    fn increase_last_component_id(&self) -> u64 {
        self.last_component_id().update(|last_id| *last_id += 1);
        self.last_component_id().get()
    }

    #[view(getLastComponentId)]
    #[storage_mapper("last_component_id")]
    fn last_component_id(&self) -> SingleValueMapper<u64>;

    #[view(getComponentById)]
    #[storage_mapper("component_by_id")]
    fn component_by_id(&self, id: u64) -> SingleValueMapper<ManagedBuffer>;

    #[view(getComponentId)]
    #[storage_mapper("component_id")]
    fn component_id(&self, component_name: &ManagedBuffer) -> SingleValueMapper<u64>;
}
