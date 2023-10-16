// Code generated by the multiversx-sc multi-contract system. DO NOT EDIT.

////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

// Init:                                 1
// Endpoints:                           13
// Async Callback (empty):               1
// Total number of exported functions:  15

#![no_std]

// Configuration that works with rustc < 1.73.0.
// TODO: Recommended rustc version: 1.73.0 or newer.
#![feature(lang_items)]

multiversx_sc_wasm_adapter::allocator!();
multiversx_sc_wasm_adapter::panic_handler!();

multiversx_sc_wasm_adapter::endpoints! {
    turbodefi_sc
    (
        init => init
        getOperator => operator_address
        setOperatorAddress => set_operator_address
        clearOperatorAddress => clear_operator_address
        addEndpoint => add_endpoint
        getLastEndpointId => last_endpoint_id
        getEndpointById => endpoint_by_id
        getEndpointId => endpoint_id
        addFlow => add_flow
        getAddressFlows => get_address_flows
        getFlowByAddressAndName => get_flow_by_name
        getLastFlowId => last_flow_id
        getFlowById => flow_by_id
        getAddressFlowsIds => address_flows_ids
    )
}

multiversx_sc_wasm_adapter::async_callback_empty! {}
