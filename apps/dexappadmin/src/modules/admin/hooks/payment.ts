import { useMutation } from "@tanstack/react-query"
import { myAppsApi } from "../dashboard/dataProvider"




export function useRemoveDomainMutation() {


  return useMutation(({ siteId }: { siteId: number }) => {

    return myAppsApi.get(`/premium-appbuilder/admin/remove-domain/${siteId}`)

  })
}

export function useDisableDexKitSignature() {


  return useMutation(({ siteId }: { siteId: number }) => {
    return myAppsApi.get(`/premium-appbuilder/admin/remove-signature/${siteId}`)

  })
}