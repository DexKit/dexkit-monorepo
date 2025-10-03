import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { AppNotificationType } from "../types";

export interface Props {
  types: { [key: string]: AppNotificationType };
  type: string;
  values?: Record<string, ReactNode>;
}

export function NotificationMessage({ types, type, values }: Props) {
  const renderValues = (values?: Record<string, ReactNode>) => {
    if (values) {
      return Object.keys(values)
        .map((key) => {
          return { key, value: values[key] };
        })
        .reduce(
          (curr: Record<string, ReactNode>, next) => {
            curr[next.key] = <strong>{next.value}</strong>;

            return curr;
          },
          {} as Record<string, ReactNode>
        );
    }

    return {};
  };

  return (
    <FormattedMessage
      id={types[type]?.id || "id"}
      defaultMessage={types[type]?.message || "message"}
      values={renderValues(values) as any}
    />
  );
}
