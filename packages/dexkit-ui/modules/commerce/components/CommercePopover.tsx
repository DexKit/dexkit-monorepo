import { Popover, PopoverProps } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuthUserQuery, useLogoutAccountMutation } from "../../../hooks";
import CommerceUserMenu from "./CommerceUserMenu";

export interface CommercePopoverProps {
  PopoverProps: PopoverProps;
  enableCommerce?: boolean;
  enableBilling?: boolean;
}

export default function CommercePopover({
  PopoverProps,
  enableCommerce,
  enableBilling,
}: CommercePopoverProps) {
  const logoutMutation = useLogoutAccountMutation();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const userQuery = useAuthUserQuery();
  const user = userQuery.data;

  const handleAction = async ({ action }: { action: string }) => {
    try {
      if (action === "logout") {
        await logoutMutation.mutateAsync();
        return;
      }
      if (action === "wishlist") {
        router.push("/c/wishlist");
      }
      if (action === "profile") {
        if (user) {
          router.push(`/u/${user?.username}`);
        } else {
          router.push(`/u/login`);
        }
      }
      if (action === "billing") {
        if (user) {
          router.push(`/u/settings?section=billing`);
        } else {
          router.push(`/u/login`);
        }
      }
      if (action === "orders") {
        router.push("/c/orders");
      }
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Popover {...PopoverProps}>
      <CommerceUserMenu
        enableCommerce={enableCommerce}
        enableBilling={enableBilling}
        onAction={handleAction}
      />
    </Popover>
  );
}
