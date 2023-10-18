## Scripts

This scripts are used to obtain data that later will be used in the dapp. Generated files will be stored in a bucket in Google Cloud storage to avoid load this data from multiversx environment (api, gateway, etc.).

Using this scripts we get updated data and upload it to theese buckets periodically. 

This information is not susceptible to change in a short period of time and therefore we do not need to load it from multiversx in each user dapp connection.
