multiversx_sc::imports!();
multiversx_sc::derive_imports!();

#[multiversx_sc::module]
pub trait OperatorModule {

    #[view(getOperator)]
    #[storage_mapper("operator_address")]
    fn operator_address(&self) -> SingleValueMapper<ManagedAddress>;

    //endpoints

    #[only_owner]
    #[endpoint(setOperatorAddress)]
    fn set_operator_address(&self, address:ManagedAddress){
        require!(self.operator_address().is_empty(), "operator_address is not empty!");
        self.operator_address().set(&address);
    }

    #[only_owner]
    #[endpoint(clearOperatorAddress)]
    fn clear_operator_address(&self){
        self.operator_address().clear();
    }

    //private functions

    fn validate_owner_or_operator(&self){
        require!(self.is_owner() || self.is_operator(), "action not allowed!");
    }

    fn is_operator(&self) -> bool{
        !self.operator_address().is_empty() && self.blockchain().get_caller() == self.operator_address().get()
    }

    fn is_owner(&self) -> bool{
        self.blockchain().get_caller() == self.blockchain().get_owner_address()
    }

}