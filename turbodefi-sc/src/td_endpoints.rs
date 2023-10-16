multiversx_sc::imports!();

use td_endpoint::TdEndpointType;

use crate::{td_endpoint, operator};

#[multiversx_sc::module]
pub trait TdEndpointsModule: operator::OperatorModule {
    #[endpoint(addEndpoint)]
    fn add_endpoint(&self, project: ManagedBuffer, module: ManagedBuffer, endpoint: ManagedBuffer) {
        self.validate_owner_or_operator();
        require!(!project.is_empty(), "project parameter is mandatory!");
        require!(!module.is_empty(), "module parameter is mandatory!");
        require!(!endpoint.is_empty(), "endpoint parameter is mandatory!");

        let endpoint = &TdEndpointType::new(project, module, endpoint);
        let endpoint_id = self.endpoint_id(endpoint).get();
        require!(
            endpoint_id == 0,
            "enpoint already exists with id: {}!",
            endpoint_id
        );

        self.increase_last_endpoint_id();
        self.endpoint_by_id(self.last_endpoint_id().get())
            .set(endpoint);
        self.endpoint_id(endpoint)
            .set(self.last_endpoint_id().get());
    }

    fn increase_last_endpoint_id(&self) {
        self.last_endpoint_id().update(|last_id| *last_id += 1);
    }

    fn validate_endpoint_exists(&self, endpoint_id: u64) {
        require!(
            !self.endpoint_by_id(endpoint_id).is_empty(),
            "endpoint_id {} doesn't exist!",
            endpoint_id
        );
    }

    #[view(getLastEndpointId)]
    #[storage_mapper("last_endpoint_id")]
    fn last_endpoint_id(&self) -> SingleValueMapper<u64>;

    #[view(getEndpointById)]
    #[storage_mapper("endpoint_by_id")]
    fn endpoint_by_id(&self, id: u64) -> SingleValueMapper<TdEndpointType<Self::Api>>;

    #[view(getEndpointId)]
    #[storage_mapper("endpoint_id")]
    fn endpoint_id(&self, endpoint: &TdEndpointType<Self::Api>) -> SingleValueMapper<u64>;
}
