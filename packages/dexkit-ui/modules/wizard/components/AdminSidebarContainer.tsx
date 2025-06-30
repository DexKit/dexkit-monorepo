import { Box, Divider, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";

import AnalyticsIcon from "@mui/icons-material/AnalyticsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";

import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import DatasetIcon from "@mui/icons-material/DatasetOutlined";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import ShoppingCart from "@mui/icons-material/ShoppingCartOutlined";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useCallback, useState } from "react";
import { useAppConfig } from "../../../hooks";
import AdminSidebarMenu from "./AdminSidebarMenu";

export enum BuilderKit {
  ALL = "All Kits",
  NFT = "NFT Kit",
  Swap = "Swap Kit",
}

export interface AdminSidebarContainerProps {
  isSiteOwner?: boolean;
  activeBuilderKit: string;
  onChangeMenu: (menuId: string) => void;
  activeMenuId: string;
  commerceEnabled?: boolean;
}

export default function AdminSidebarContainer({
  isSiteOwner,
  onChangeMenu,
  activeMenuId,
  activeBuilderKit,
  commerceEnabled,
}: AdminSidebarContainerProps) {
  const appConfig = useAppConfig();
  const [openMenus, setOpenMenu] = useState<{ [key: string]: boolean }>({});

  const handleToggleMenu = useCallback((menu: string) => {
    return () => {
      setOpenMenu((value) => ({ ...value, [menu]: !Boolean(value[menu]) }));
    };
  }, []);

  const isMenuToggled = useCallback(
    (menu: string) => {
      return Boolean(openMenus[menu]);
    },
    [openMenus]
  );

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.grey[100],
        }}
      >
        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<SettingsIcon />}
          title={<FormattedMessage id="settings" defaultMessage="Settings" />}
          open={isMenuToggled("settings")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("settings")}
          isSiteOwner={isSiteOwner}
          options={[
            {
              id: "settings.general",
              title: <FormattedMessage id="general" defaultMessage="General" />,
            },
            {
              id: "settings.domain",
              title: <FormattedMessage id="domains" defaultMessage="Domain" />,
              icon: <WorkspacePremiumIcon />,
            },
            {
              id: "settings.powered.by",
              title: (
                <FormattedMessage id="powered.by" defaultMessage="Powered by" />
              ),
              icon: <WorkspacePremiumIcon />,
              onlyOwner: true,
            },
            {
              id: "settings.team",
              title: <FormattedMessage id="team" defaultMessage="Team" />,
              onlyOwner: true,
            },

            {
              id: "settings.version",
              title: <FormattedMessage id="version" defaultMessage="Version" />,
              onlyOwner: true,
            },

            {
              id: "settings.ownership",
              title: (
                <FormattedMessage id="ownership" defaultMessage="Ownership" />
              ),
              onlyOwner: true,
            },

            {
              id: "settings.social",
              title: (
                <FormattedMessage
                  id="social.media"
                  defaultMessage="Social Media"
                />
              ),
            },
            {
              id: "settings.integrations",
              title: (
                <FormattedMessage
                  id="integrations"
                  defaultMessage="Integrations"
                />
              ),
            },
          ]}
        />
        <Divider />
        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<SpaceDashboardIcon />}
          title={<FormattedMessage id="layout" defaultMessage="Layout" />}
          open={isMenuToggled("layout")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("layout")}
          isSiteOwner={isSiteOwner}
          options={[
            {
              id: "layout.theme",
              title: <FormattedMessage id="theme" defaultMessage="Theme" />,
            },
            {
              id: "layout.pages",
              title: <FormattedMessage id="pages" defaultMessage="Pages" />,
            },
            {
              id: "layout.navbar",
              title: <FormattedMessage id="navbar" defaultMessage="Navbar" />,
              onlyOwner: true,
            },

            {
              id: "layout.footer.menu",
              title: (
                <FormattedMessage
                  id="footer.menu"
                  defaultMessage="Footer"
                />
              ),
              onlyOwner: true,
            },

            {
              id: "layout.seo",
              title: <FormattedMessage id="seo" defaultMessage="SEO" />,
              onlyOwner: true,
            },
            {
              id: "layout.analytics",
              title: (
                <FormattedMessage id="analytics" defaultMessage="Analytics" />
              ),
            },
          ]}
        />
        <Divider />

        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<CurrencyExchangeIcon />}
          title={<FormattedMessage id="fees" defaultMessage="Fees" />}
          open={isMenuToggled("fees")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("fees")}
          isSiteOwner={isSiteOwner}
          options={[
            ...(activeBuilderKit !== BuilderKit.Swap
              ? [
                  {
                    id: "fees.marketplace.fees",
                    title: (
                      <FormattedMessage
                        id="marketplace.fees.menu.container"
                        defaultMessage="Marketplace Fees"
                      />
                    ),
                  },
                ]
              : []),
            ...(activeBuilderKit !== BuilderKit.NFT
              ? [
                  {
                    id: "swap-fees",
                    title: (
                      <FormattedMessage
                        id="swap.fees.menu.container"
                        defaultMessage="Swap Fees"
                      />
                    ),
                  },
                ]
              : []),
          ]}
        />

        <Divider />
        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<DatasetIcon />}
          title={<FormattedMessage id="data" defaultMessage="Data" />}
          open={isMenuToggled("data")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("data")}
          isSiteOwner={isSiteOwner}
          options={[
            ...(activeBuilderKit !== BuilderKit.Swap
              ? [
                  {
                    id: "data.collections",
                    title: (
                      <FormattedMessage
                        id="collections"
                        defaultMessage="Collections"
                      />
                    ),
                  },
                ]
              : []),
            {
              id: "data.tokens",
              title: <FormattedMessage id="tokens" defaultMessage="Tokens" />,
            },
            {
              id: "data.networks",
              title: (
                <FormattedMessage id="networks" defaultMessage="Networks" />
              ),
            },
          ]}
        />
        <Divider />

        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<AnalyticsIcon />}
          title={<FormattedMessage id="analytics" defaultMessage="Analytics" />}
          open={isMenuToggled("analytics")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("analytics")}
          isSiteOwner={isSiteOwner}
          options={[
            // add builder kits,
            {
              id: "analytics.events",
              title: <FormattedMessage id="events" defaultMessage="Events" />,
            },
            {
              id: "analytics.leaderboard",
              title: (
                <FormattedMessage
                  id="leaderboard"
                  defaultMessage="Leaderboard"
                />
              ),
            },
          ]}
        />
        <Divider />
        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<GavelRoundedIcon />}
          title={
            <FormattedMessage id="dexcontracts" defaultMessage="DexContracts" />
          }
          open={isMenuToggled("dexcontracts")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("dexcontracts")}
          isSiteOwner={isSiteOwner}
          options={[
            // add builder kits,
            {
              id: "create.contracts",
              title: (
                <FormattedMessage
                  id="create.contracts"
                  defaultMessage="Create contracts"
                />
              ),
            },
            {
              id: "manage.contracts",
              title: (
                <FormattedMessage
                  id="manage.contracts"
                  defaultMessage="Manage contracts"
                />
              ),
            },
            /* {
              id: "create.contract.forms",
              title: (
                <FormattedMessage
                  id="create.contract.forms"
                  defaultMessage="Create contract forms"
                />
              ),
            },
            {
              id: "manage.contract.forms",
              title: (
                <FormattedMessage
                  id="manage.contract.forms"
                  defaultMessage="Manage contract forms"
                />
              ),
            },*/
          ]}
        />
        {isSiteOwner && (
          <>
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.background.default
                    : theme.palette.grey[100],
              }}
            >
              {commerceEnabled && (
                <AdminSidebarMenu
                  activeMenuId={activeMenuId}
                  icon={<ShoppingCart />}
                  title={
                    <FormattedMessage
                      id="e.commerce"
                      defaultMessage="E-Commerce"
                    />
                  }
                  open={isMenuToggled("commerce")}
                  onSelectMenuId={onChangeMenu}
                  onToggle={handleToggleMenu("commerce")}
                  isSiteOwner={isSiteOwner}
                  options={[
                    // add builder kits,
                    {
                      id: "commerce.dashboard",
                      title: (
                        <FormattedMessage
                          id="dashboard"
                          defaultMessage="Dashboard"
                        />
                      ),
                    },
                    {
                      id: "commerce.notifications",
                      title: (
                        <FormattedMessage
                          id="notifications"
                          defaultMessage="Notifications"
                        />
                      ),
                    },
                    {
                      id: "commerce.settings",
                      title: (
                        <FormattedMessage
                          id="settings"
                          defaultMessage="Settings"
                        />
                      ),
                    },
                    {
                      id: "commerce.orders",
                      title: (
                        <FormattedMessage id="orders" defaultMessage="Orders" />
                      ),
                    },
                    {
                      id: "commerce.products",
                      title: (
                        <FormattedMessage
                          id="products"
                          defaultMessage="Products"
                        />
                      ),
                      options: [
                        {
                          title: (
                            <FormattedMessage
                              id="items"
                              defaultMessage="Items"
                            />
                          ),
                          id: "commerce.products.items",
                        },
                        {
                          title: (
                            <FormattedMessage
                              id="categories"
                              defaultMessage="Categories"
                            />
                          ),
                          id: "commerce.products.categories",
                        },
                        {
                          title: (
                            <FormattedMessage
                              id="collections"
                              defaultMessage="Collections"
                            />
                          ),
                          id: "commerce.products.collections",
                        },
                      ],
                    },
                    {
                      id: "commerce.checkouts",
                      title: (
                        <FormattedMessage
                          id="checkouts"
                          defaultMessage="Checkouts"
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Box>
          </>
        )}
        <AdminSidebarMenu
          activeMenuId={activeMenuId}
          icon={<WidgetsOutlinedIcon />}
          title={<FormattedMessage id="widgets" defaultMessage="Widgets" />}
          open={isMenuToggled("widgets")}
          onSelectMenuId={onChangeMenu}
          onToggle={handleToggleMenu("widgets")}
          isSiteOwner={isSiteOwner}
          options={[
            // add builder kits,
            {
              id: "manage.widgets",
              title: (
                <FormattedMessage
                  id="manage.widgets"
                  defaultMessage="Manage widgets"
                />
              ),
            },
            /* {
              id: "create.contract.forms",
              title: (
                <FormattedMessage
                  id="create.contract.forms"
                  defaultMessage="Create contract forms"
                />
              ),
            },
            {
              id: "manage.contract.forms",
              title: (
                <FormattedMessage
                  id="manage.contract.forms"
                  defaultMessage="Manage contract forms"
                />
              ),
            },*/
          ]}
        />
      </Box>

      {/*isSiteOwner && (
        <>
          {commerceEnabled && (
            <Typography variant="body1" fontWeight="bold">
              <FormattedMessage
                id="integrations"
                defaultMessage="Integrations"
              />
            </Typography>
          )}

          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.palette.background.default
                  : theme.palette.grey[100],
            }}
          >
            {commerceEnabled && (
              <AdminSidebarMenu
                activeMenuId={activeMenuId}
                icon={<ShoppingCart />}
                title={
                  <FormattedMessage
                    id="e.commerce"
                    defaultMessage="E-Commerce"
                  />
                }
                subtitle={<FormattedMessage id="beta" defaultMessage="BETA" />}
                open={isMenuToggled("commerce")}
                onSelectMenuId={onChangeMenu}
                onToggle={handleToggleMenu("commerce")}
                isSiteOwner={isSiteOwner}
                options={[
                  // add builder kits,
                  {
                    id: "commerce.dashboard",
                    title: (
                      <FormattedMessage
                        id="dashboard"
                        defaultMessage="Dashboard"
                      />
                    ),
                  },
                  {
                    id: "commerce.notifications",
                    title: (
                      <FormattedMessage
                        id="notifications"
                        defaultMessage="Notifications"
                      />
                    ),
                  },
                  {
                    id: "commerce.settings",
                    title: (
                      <FormattedMessage
                        id="settings"
                        defaultMessage="Settings"
                      />
                    ),
                  },
                  {
                    id: "commerce.orders",
                    title: (
                      <FormattedMessage id="orders" defaultMessage="Orders" />
                    ),
                  },
                  {
                    id: "commerce.products",
                    title: (
                      <FormattedMessage
                        id="products"
                        defaultMessage="Products"
                      />
                    ),
                    options: [
                      {
                        title: (
                          <FormattedMessage id="items" defaultMessage="Items" />
                        ),
                        id: "commerce.products.items",
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="categories"
                            defaultMessage="Categories"
                          />
                        ),
                        id: "commerce.products.categories",
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="collections"
                            defaultMessage="Collections"
                          />
                        ),
                        id: "commerce.products.collections",
                      },
                    ],
                  },
                  {
                    id: "commerce.checkouts",
                    title: (
                      <FormattedMessage
                        id="checkouts"
                        defaultMessage="Checkouts"
                      />
                    ),
                  },
                ]}
              />
            )}
          </Box>
        </>
      )*/}
    </Stack>
  );
}
