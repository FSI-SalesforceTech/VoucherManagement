#!/bin/bash

SFDX_CLI_EXEC="sfdx"
PACKAGENAME="voucherManagement"
DEV_HUB="bunai-crm"
SAND_HUB="sandbox"

ORG_LIST="$($SFDX_CLI_EXEC force:org:list)"
echo ORG_LIST | jp

PACKAGE_RESULT="$($SFDX_CLI_EXEC force:package:version:create -p $PACKAGENAME -d force-app -x -w 10 -v $DEV_HUB --json)"
echo $PACKAGE_RESULT | jq
PACKAGE_VERSION="$(echo $PACKAGE_RESULT | jq '.result.SubscriberPackageVersionId' | tr -d '"')"
echo PACKAGE_VERSION | jq

INSTALL_RESULT="$($SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION --publishwait 10 -w 10 -u $SAND_HUB -r)"
echo "$SFDX_CLI_EXEC force:package:install --package $PACKAGE_VERSION -w 10 --publishwait 10 -u $SAND_HUB -r"
echo INSTALL_RESULT | jp
