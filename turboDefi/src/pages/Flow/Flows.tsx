export const Flows = {
    flow_1: {
        "name": "flow-1",
        "label": "Flow 1",
        "description": "This flow will save a lot of time to the user",
        "steps": [
            {
                "description": "Claim pending rewards from $CYBER Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "claim"
                    }
                ]
            },
            {
                "description": "Claim pending rewards from CityNFT Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "claimReward"
                    }
                ]
            },
            {
                "description": "Swap claimed $CYBER to whatever you want",
                "component": "AshSwap",
                "componentProps": {
                    "defaultTokenFrom": "CYBER-489c1c"
                }
            }
        ]
    },
    flow_2: {
        "name": "flow-2",
        "label": "NFT projects rewards",
        "description": "Claim rewards from NFT projects and swap",
        "steps": [
            {
                "description": "Claim pending rewards from $CYBER Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "cyber_token",
                        "endpoint": "claim"
                    }
                ]
            },
            {
                "description": "Claim pending rewards from CityNFT Stake",
                "endpoints": [
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "getAccountState"
                    },
                    {
                        "project": "cyberpunkcity",
                        "module": "city_nft",
                        "endpoint": "claimReward"
                    }
                ]
            },
            {
                "description": "Claim pending rewards from GNG",
                "endpoints": [
                    {
                        "project": "gnogen",
                        "module": "staking",
                        "endpoint": "getPendingRewardsForAddress"
                    },
                    {
                        "project": "gnogen",
                        "module": "staking",
                        "endpoint": "claimRewards"
                    }
                ]
            },
            {
                "description": "Swap claimed tokens to whatever you want",
                "component": "AshSwap"
            }
        ]
    }
};