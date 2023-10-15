PROJECT_PATH="${HOME}/codigo/hackaton/turbodefi-sc"

ENVIRONMENT=devnet
source "${PROJECT_PATH}/interaction/env_${ENVIRONMENT}.sh"

ADDRESS=$(mxpy data load --key=address-${ENVIRONMENT})
DEPLOY_TRANSACTION=$(mxpy data load --key=deployTransaction-${ENVIRONMENT})

deploy() {
    mxpy --verbose contract deploy --recall-nonce --pem="${OWNER}" --gas-limit=50000000 \
    --bytecode="${PROJECT_PATH}/output/turbodefi-sc.wasm" \
    --send --outfile="deploy-${ENVIRONMENT}.interaction.json" --proxy=${PROXY} --chain=${CHAIN_ID} || return

    TRANSACTION=$(mxpy data parse --file="deploy-${ENVIRONMENT}.interaction.json" --expression="data['emittedTransactionHash']")
    ADDRESS=$(mxpy data parse --file="deploy-${ENVIRONMENT}.interaction.json" --expression="data['contractAddress']")

    mxpy data store --key=address-${ENVIRONMENT} --value="${ADDRESS}"
    mxpy data store --key=deployTransaction-${ENVIRONMENT} --value="${TRANSACTION}"

    echo ""
    echo "Smart contract address: ${ADDRESS}"
}

upgrade() {
    mxpy --verbose contract upgrade "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=150000000 --send \
    --outfile="upgrade-${ENVIRONMENT}.interaction.json" \
    --bytecode="${PROJECT_PATH}"/output/turbodefi-sc.wasm \
    --proxy=${PROXY} --chain=${CHAIN_ID} || return
}

# ************************************* OPERATOR *************************************

setOperator() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=20000000 \
        --function="setOperatorAddress" --arguments ${OPERATOR_ID} \
        --send --proxy=${PROXY} --chain=${CHAIN_ID}
}

getOperator() {
    mxpy --verbose contract query "${ADDRESS}" --function="getOperatorAddress" --proxy=${PROXY}
}

clearOperator() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=20000000 \
        --value 0 --function="clearOperatorAddress" \
        --send --proxy=${PROXY} --chain=${CHAIN_ID}
}

# ************************************* END OPERATOR *************************************

# ************************************* ENDPOINTS *************************************

addEndpoint() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=20000000 \
        --function="addEndpoint" --arguments "str:$1" "str:$2" "str:$3"  \
        --send --proxy=${PROXY} --chain=${CHAIN_ID}
}

getEndpointById() {
    mxpy --verbose contract query "${ADDRESS}" --function="getEndpointById" --arguments $1 --proxy=${PROXY}
}

getLastEndpointId() {
    mxpy --verbose contract query "${ADDRESS}" --function="getLastEndpointId" --proxy=${PROXY}
}

# ************************************* END ENDPOINTS *************************************

# ************************************* FLOWS *************************************

addFlow() {
    mxpy --verbose contract call "${ADDRESS}" --recall-nonce --pem="${OWNER}" --gas-limit=20000000 \
        --function="addFlow" --arguments "str:$1" "str:$2" "str:$3"  \
        --send --proxy=${PROXY} --chain=${CHAIN_ID}
}

getLastFlowId() {
    mxpy --verbose contract query "${ADDRESS}" --function="getLastFlowId" --proxy=${PROXY}
}

getFlowById() {
    mxpy --verbose contract query "${ADDRESS}" --function="getFlowById" --arguments $1 --proxy=${PROXY}
}

getAddressFlows() {
    mxpy --verbose contract query "${ADDRESS}" --function="getAddressFlows" --arguments $1 --proxy=${PROXY}
}

# ************************************* END FLOWS *************************************