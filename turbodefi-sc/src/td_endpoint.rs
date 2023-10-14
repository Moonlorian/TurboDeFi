multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[derive(ManagedVecItem, NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi)]
pub struct TdEndpointType<M: ManagedTypeApi> {
    pub project: ManagedBuffer<M>,
    pub module: ManagedBuffer<M>,
    pub endpoint: ManagedBuffer<M>,
}

impl<M: ManagedTypeApi> TdEndpointType<M> {
    pub fn new(
        project: ManagedBuffer<M>,
        module: ManagedBuffer<M>,
        endpoint: ManagedBuffer<M>,
    ) -> Self {
        TdEndpointType {
            project,
            module,
            endpoint,
        }
    }
}
