#!/bin/bash

# generate files `priv_validator.json`, `genesis.json`, `config.toml`
TMHOME="$(pwd)" ./node_modules/lotion/bin/tendermint init

# remove config.toml. we will use .env instead
rm -f ./config.toml