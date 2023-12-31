export const ashAbi = {
  buildInfo: {
    rustc: {
      version: '1.70.0-nightly',
      commitHash: '2036fdd24f77d607dcfaa24c48fbe85d3f785823',
      commitDate: '2023-03-27',
      channel: 'Nightly',
      short: 'rustc 1.70.0-nightly (2036fdd24 2023-03-27)'
    },
    contractCrate: {
      name: 'aggregator',
      version: '0.0.0'
    },
    framework: {
      name: 'multiversx-sc',
      version: '0.40.0'
    }
  },
  name: 'AggregatorContract',
  constructor: {
    inputs: [],
    outputs: []
  },
  endpoints: [
    {
      name: 'aggregate',
      mutability: 'mutable',
      payableInTokens: ['*'],
      inputs: [
        {
          name: 'steps',
          type: 'List<AggregatorStep>'
        },
        {
          name: 'limits',
          type: 'variadic<TokenAmount>',
          multi_arg: true
        }
      ],
      outputs: [
        {
          type: 'List<EsdtTokenPayment>'
        }
      ]
    }
  ],
  events: [],
  hasCallback: false,
  types: {
    AggregatorStep: {
      type: 'struct',
      fields: [
        {
          name: 'token_in',
          type: 'TokenIdentifier'
        },
        {
          name: 'token_out',
          type: 'TokenIdentifier'
        },
        {
          name: 'amount_in',
          type: 'BigUint'
        },
        {
          name: 'pool_address',
          type: 'Address'
        },
        {
          name: 'function_name',
          type: 'bytes'
        },
        {
          name: 'arguments',
          type: 'List<bytes>'
        }
      ]
    },
    EsdtTokenPayment: {
      type: 'struct',
      fields: [
        {
          name: 'token_identifier',
          type: 'TokenIdentifier'
        },
        {
          name: 'token_nonce',
          type: 'u64'
        },
        {
          name: 'amount',
          type: 'BigUint'
        }
      ]
    },
    TokenAmount: {
      type: 'struct',
      fields: [
        {
          name: 'token',
          type: 'TokenIdentifier'
        },
        {
          name: 'amount',
          type: 'BigUint'
        }
      ]
    }
  }
};
