#!/bin/bash

SFDX_CLI_EXEC="sfdx"
PACKAGENAME="voucherManagement"
DEV_HUB="bunai-crm"

PACKAGE_VERSION="$($SFDX_CLI_EXEC force:package:version:list -p $PACKAGENAME -v $DEV_HUB)"
echo $PACKAGE_VERSION | jq