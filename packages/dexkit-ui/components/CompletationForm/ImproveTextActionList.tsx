import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CodeIcon from "@mui/icons-material/Code";
import RefreshIcon from "@mui/icons-material/Refresh";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

import NotesIcon from "@mui/icons-material/Notes";
import ShortTextIcon from "@mui/icons-material/ShortText";

import ImageIcon from "@mui/icons-material/Image";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { textImproveItems } from "../../constants/ai";
import { TextImproveAction, TextImproveItem } from "../../types/ai";

export interface ImproveTextActionListProps {
  value?: string;
  disabled?: boolean;
  onChange: (value: TextImproveItem) => void;
  filteredActions?: TextImproveAction[];
}

export default function ImproveTextActionList({
  onChange,
  value,
  disabled,
  filteredActions,
}: ImproveTextActionListProps) {
  const handleClick = (item: TextImproveItem) => {
    return () => onChange(item);
  };

  const getDynamicContent = (action: string) => {
    switch (action) {
      case TextImproveAction.GENERATE:
        return {
          label: (
            <FormattedMessage
              id="generate.new.text"
              defaultMessage="Generate new text"
            />
          ),
          icon: <RefreshIcon />,
        };
      case TextImproveAction.IMPROVE_SPELLING:
        return {
          label: (
            <FormattedMessage
              id="fix.spelling.and.grammar"
              defaultMessage="Fix spelling and grammar"
            />
          ),
          icon: <SpellcheckIcon />,
        };
      case TextImproveAction.MAKE_SHORTER:
        return {
          label: (
            <FormattedMessage id="make.shorter" defaultMessage="Make shorter" />
          ),
          icon: <ShortTextIcon />,
        };
      case TextImproveAction.MAKE_LONGER:
        return {
          label: (
            <FormattedMessage id="make.longer" defaultMessage="Make longer" />
          ),
          icon: <NotesIcon />,
        };

      case TextImproveAction.IMPROVE_WRITING:
        return {
          label: (
            <FormattedMessage
              id="improve.writing"
              defaultMessage="Improve writing"
            />
          ),
          icon: <AutoAwesomeIcon />,
        };
      case TextImproveAction.GENERATE_IMAGE:
        return {
          label: (
            <FormattedMessage
              id="generate.image"
              defaultMessage="Generate image"
            />
          ),
          icon: <ImageIcon />,
        };

      case TextImproveAction.GENERATE_CODE:
      default:
        return {
          label: (
            <FormattedMessage
              id="generate.code"
              defaultMessage="Generate code"
            />
          ),
          icon: <CodeIcon />,
        };
    }
  };

  return (
    <List disablePadding>
      {textImproveItems
        .filter(
          (item) =>
            filteredActions === undefined ||
            filteredActions.includes(item.action)
        )
        .map((item) => {
          return (
            <ListItemButton
              key={item.action}
              disabled={disabled}
              selected={value === item.action}
              onClick={handleClick(item)}
            >
              <ListItemIcon>{getDynamicContent(item.action).icon}</ListItemIcon>
              <ListItemText primary={getDynamicContent(item.action).label} />
            </ListItemButton>
          );
        })}
    </List>
  );
}
