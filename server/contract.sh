#!/bin/sh

echo The contract is deploying!

near-sdk-js build server/clientContract/clientContract.js clientBuild/code.wasm