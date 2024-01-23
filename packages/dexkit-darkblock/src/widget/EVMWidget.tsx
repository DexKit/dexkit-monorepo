import { Stack, utils, widgetMachine } from "@darkblock.io/shared-components";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";

import { DARKBLOCK_EVM_NETWORKS } from "../constants.ts/network";
import signTypedData, { SIGNING_TYPE } from "../utils/signTypeData";


interface Props{
  contractAddress: string;
  tokenId?: string;
  account?: string;
  chainId?: number;
  dev?: boolean;
  dbConfig?: string | null;
  cb?: any,
  provider: any;
  config?: {
    customCssClass: string,
    debug: boolean,
    imgViewer: {
      showRotationControl: boolean,
      autoHideControls: boolean,
      controlsFadeDelay: boolean,
    },
  }
}


const EVMDarkblockWidget = ({
  contractAddress,
  tokenId,
  account,
  provider = null,
  cb = null,
  chainId,
  config = {
    customCssClass: "",
    debug: false,
    imgViewer: {
      showRotationControl: true,
      autoHideControls: true,
      controlsFadeDelay: true,
    },
  },
  dev = false,
  dbConfig = null,
}: Props) => {

  const platform = chainId ?  DARKBLOCK_EVM_NETWORKS[chainId] : 'Ethereum'

  const [state, send] = useMachine(() => widgetMachine(tokenId, contractAddress, platform, dev, dbConfig))
  const [address, setAddress] = useState<string | null>(account ? account.toLowerCase() : null)
  const [mediaURL, setMediaURL] = useState("")
  const [stackMediaURLs, setStackMediaURLs] = useState<string[]>([])
  const [epochSignature, setEpochSignature] = useState<string | null>(null)

  const callback = (state: any) => {
    if (config.debug) console.log("Callback function called from widget. State: ", state)

    if (typeof cb !== "function") return

    try {
      cb(state)
    } catch (e) {
      console.log("Callback function error: ", e)
    }
  }


  useEffect(() => {
    callback(state.value)
    if (!account) {
      setAddress(null)
      send({ type: "NO_WALLET" })
    } else {
      if (state.value === "idle") {
        send({ type: "FETCH_ARWEAVE" })
      }

      if (state.value === "started") {
          if (account) {
            setAddress(account.toLowerCase())
            send({ type: "CONNECT_WALLET" })
          }      
      }

      if (state.value === "wallet_connected") {
        if(!account){
          setAddress(null);
          send({ type: "DISCONNECT_WALLET" });
        }
        // send({ type: "SIGN" })
      }

      if (state.value === "signing") {
        authenticate()
      }

      if (state.value === "authenticated") {
        
        if(!account){
          setAddress(null);
          send({ type: "DISCONNECT_WALLET" });
        }else{
          send({ type: "DECRYPT" })
        }
      }

      if (state.value === "decrypting") {
        setMediaURL(
          utils.getProxyAsset(
            state.context.artId,
            epochSignature,
            state.context.tokenId,
            state.context.contractAddress,
            null,
            platform,
            address
          )
        )

        let arrTemp: string[] = []

        state.context.display.stack.map((db: any) => {
          arrTemp.push(
            utils.getProxyAsset(
              db.artId,
              epochSignature,
              state.context.tokenId,
              state.context.contractAddress,
              null,
              platform,
              address
            )
          )
        })

        setStackMediaURLs(arrTemp)

        setTimeout(() => {
          send({ type: "SUCCESS" })
        }, 1000)
      }

      if (state.value === "display") {
        if(!account){
          setAddress(null);
          send({ type: "DISCONNECT_WALLET" });
        }
      }
    }
  }, [state.value, account])

  const authenticate = async () => {
    if(!account){
      return;
    }

    let signature
    let epoch = Date.now()
    let sessionToken = epoch + account
    let ownerDataWithOwner

    try {    
      ownerDataWithOwner = await utils.getOwner(contractAddress, tokenId, platform, account, dev)

      if (
        !ownerDataWithOwner ||
        !ownerDataWithOwner.owner_address ||
        ownerDataWithOwner.owner_address.toLowerCase() !== account.toLowerCase()
      ) {
        send({ type: "FAIL" })
      } else {
        signature = await signTypedData({data: sessionToken, account, type: SIGNING_TYPE.accessAuth, provider}).then((response) => {
          return response
        })

        if (signature) {
          send({ type: "SUCCESS" })
        } else {
          send({ type: "FAIL" })
        }
      }
    } catch (e) {
      signature ? send({ type: "FAIL" }) : send({ type: "CANCEL" })
    }

    setEpochSignature(epoch + "_" + signature)
  }
 

  return <Stack state={state} authenticate={() => send({ type: "SIGN" })} urls={stackMediaURLs} config={config} />
}

export default EVMDarkblockWidget