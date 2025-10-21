import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

const Anchor = styled("a")({});

interface NextLinkComposedProps
  extends Omit<React.HTMLAttributes<HTMLAnchorElement>, "href">,
    Omit<
      NextLinkProps,
      "href" | "as" | "onMouseEnter" | "onClick" | "onTouchStart"
    > {
  to: NextLinkProps["href"];
  linkAs?: NextLinkProps["as"];
}

export const NextLinkComposed = (React as any).forwardRef(function NextLinkComposed(props: NextLinkComposedProps, ref: any) {
  const {
    to,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
    ...other
  } = props;

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      locale={locale}
      ref={ref}
      {...other}
    />
  );
});

export type LinkProps = {
  activeClassName?: string;
  as?: NextLinkProps["as"];
  href: NextLinkProps["href"];
  linkAs?: NextLinkProps["as"];
  noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, "to" | "linkAs" | "href"> &
  Omit<MuiLinkProps, "href">;

const Link = (React as any).forwardRef(function Link(
  props: LinkProps,
  ref: any
) {
  const {
    activeClassName = "active",
    as,
    className: classNameProps,
    href,
    linkAs: linkAsProp,
    locale,
    noLinkStyle,
    prefetch,
    replace,
    role,
    scroll,
    shallow,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  const defaultLinkStyles = {
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    '&:visited': {
      color: 'inherit',
    },
    '&:link': {
      color: 'inherit',
    },
  };

  const isExternal =
    typeof href === "string" &&
    (href.indexOf("http") === 0 || href.indexOf("mailto:") === 0);

  if (isExternal) {
    if (noLinkStyle) {
      return <Anchor className={className} href={href} ref={ref} sx={defaultLinkStyles} {...other} />;
    }

    return <MuiLink className={className} href={href} ref={ref} sx={defaultLinkStyles} {...other} />;
  }

  const linkAs = linkAsProp || as;
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
  };

  if (noLinkStyle) {
    return (
      <NextLinkComposed
        className={className}
        ref={ref}
        sx={defaultLinkStyles}
        {...nextjsProps}
        {...other}
      />
    );
  }

  return (
    <MuiLink
      component={NextLinkComposed as any}
      className={className}
      ref={ref}
      sx={defaultLinkStyles}
      {...nextjsProps}
      {...other}
    />
  );
});

export default Link;
